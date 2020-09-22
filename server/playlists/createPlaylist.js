const { appSpotifyAPI, UserSpotifyAPI } = require('../config/spotify');
const SpotifyUser = require('../models/spotifyUser');
const { getUpcomingEvents } = require('../services/songkickService');
const Constants = require('../config/constants');

/*
This is a sketch of all the functions I think I'll need to 
create a playlist. It is possible they should all return 
promises (or at least the ones that make api calls should).
*/ 

class PlaylistCreator {
    constructor(user, access) {
        if (!user)  {
            throw new Error("can't create playlists without a user");
        }
        this.user = user;
        this.userSpotifyAPI = new UserSpotifyAPI(access, user)
    }

    // reduce upcoming events to a list of artist objects
    getArtistsFromEvents(events) {
        if (!events || events.length === 0) {
            return;
        }
        return events.reduce((artistsSoFar, event) => {
            const performances = event.performance;
            const artistsToAdd = performances.map((performance) => {
                return {
                    displayName: performance.artist.displayName,
                    eventID: event.id
                }
            });
            return artistsSoFar.concat(artistsToAdd);
        }, []);
    }

    // search spotify for each artist to find their spotify id
    async getArtistSpotifyID(artistDisplayName) {
        try {
            const data = await appSpotifyAPI.ensureAccessToken(
                'searchArtists', [artistDisplayName]);
            if (!data.body.artists.items[0]) {
                console.log("no results for", artistDisplayName);
                return "";
            }
            // extract the spotify ID from the first result
            return data.body.artists.items[0].id
        } catch (err) {
            console.log("couldn't get artist spotify ID", err);
        }
    }

    async getAllArtistsSpotifyIDs(artists) {
        try {
            const addArtistID = async (artist) => {
                artist.spotifyID = await this.getArtistSpotifyID(
                    artist.displayName);
                return artist;
            }
            // to make sure we don't try to ensureAccessToken 
            // multiple times at once, do one call first, then 
            // the rest, then put the list back together
            const firstArtistWithID = await addArtistID(artists[0]);
            const restOfArtistsWithIDs = await Promise.all(
                artists.slice(1).map(addArtistID)
            ); // order doesn't really matter
            restOfArtistsWithIDs.push(firstArtistWithID);
            const artistsWithIDs = restOfArtistsWithIDs;

            // return only the ones that have a spotifyID
            return artistsWithIDs.filter(artist => artist.spotifyID);
        } catch (err) {
            console.log("something went wrong getting all the artist ids", err);
        }
    }

    // get the spotify URIs of each artist's top tracks
    async getArtistTopTrackURIs(artistID) {
        if (!artistID) {
            return [];
        }
        try {
            const data = await appSpotifyAPI.getArtistTopTracks(
                artistID, 'from_token');
            return data.body.tracks.map(track => track.uri);
        } catch (err) {
            console.log("couldn't get artist top tracks", err);
        }
    }

    getAllArtistsTopTrackURIs(artistIDs) {
        const uniqueArtistIDs = Array.from(new Set(artistIDs));
        return Promise.all(uniqueArtistIDs.map((artistID) => 
            this.getArtistTopTrackURIs(artistID)));
    }

    async createUserAppPlaylist(description) {
        // it's also possible that the playlist title should be programmatically generated to include something identifying the user
        // something like "Coming To You Live" (but I don't know how I'd identify the user)
        description = description || '';
        try {
            // we want to allow the user to modify this themselves
            const data = await appSpotifyAPI.ensureAccessToken(
                'createPlaylist', [
                    Constants.APP_SPOTIFY_ID, 
                    Constants.PLAYLIST_TITLE,
                    { description, public: false, collaborative: true }
            ]);
            console.log("we tried to create a playlist");
            const playlistID = data.body.id;

            console.log('trying to follow the playlist...');
            await this.userSpotifyAPI.ensureAccessToken(
                'followPlaylist', [playlistID, {'public' : false}]);
            
            // we also need to update the user's playlistID in the database
            console.log('trying to update the database...');
            await SpotifyUser.findOneAndUpdate(
                    { spotifyID: this.user.spotifyID }, 
                    { $set: { playlistID } });
            console.log('successfully created and followed a new app playlist!');
            return playlistID;
        } catch (err) {
            console.log("something went wrong while trying to create a playlist", err);
        } 
    }

    // find or create playlist to modify (returns the playlist ID)
    async findOrCreateUserAppPlaylist(description) {
        if (this.user.playlistID) {
            if (description) {
                await this.updatePlaylistDescription(
                        this.user.playlistID, description);
            }
            return this.user.playlistID;
        } else {
            return await this.createUserAppPlaylist(description);
        }
    }

    // figure out which tracks you're gonna add to playlist
    compileAllArtistsTopTracksForPlaylist(topTrackLists) {
        // maybe to start with just take the top three tracks from 
        // each list?
        const tracks = topTrackLists.reduce((tracksSoFar, trackList) => {
            const tracksToAdd = trackList.slice(0, Constants.TRACKS_PER_ATRIST);
            return tracksSoFar.concat(tracksToAdd);
        }, []);
        const uniqueTracks = Array.from(new Set(tracks));
        return uniqueTracks;
    }

    compileEventsForPlaylist(events) {
        events = events.filter(event => event.status === 'ok');
        // this is me trimming the search results
        // so we don't hit the spotify api rate limits
        events = events.slice(0, Constants.INITIAL_EVENTS_PER_PLAYLIST);
        return events;
    }

    getEventDescription(event) {
        return event.displayName;
    }

    compileEventDescriptions(events) {
        const eventDescriptions = events.map(this.getEventDescription);
        return eventDescriptions.join(" | ");
    }

    async updatePlaylistDescription(playlistID, description) {
        try {
            return await appSpotifyAPI.ensureAccessToken(
                'changePlaylistDetails', 
                [ playlistID, { description } ]);
        } catch (err) {
            console.log("couldn't update the description", err)
        }
    }

    // add the resulting list of tracks to the playlist
    async updatePlaylistTracks(playlistID, tracks) {
        try {
            const data = await appSpotifyAPI.ensureAccessToken(
                'replaceTracksInPlaylist', 
                [ playlistID, tracks ]);
            console.log("added tracks!");
            return data;
        } catch (err) {
            console.log(err);
        };
    }

    // do all the above steps in one function
    async createLivePlaylist(eventsSearchQuery) {
        try {
            const eventSearchResults = await getUpcomingEvents(eventsSearchQuery);
            const events = eventSearchResults.resultsPage.results.event;
            if (!events) {
                console.log("no events to create a playlist from");
                return "no events";
            }
            // get only the events we want to use for the playlist
            const compiledEvents = this.compileEventsForPlaylist(events);
            // get list of objects with artist display names and their event ids
            const artistsWithEvents = this.getArtistsFromEvents(compiledEvents);
            // add spotify ids to objects, or drop them from the list 
            const artistsWithIDs = await this.getAllArtistsSpotifyIDs(artistsWithEvents);
            // make the tracklist from the spotify artists
            const artistIDs = artistsWithIDs.map(artist => artist.spotifyID);
            const topTrackLists = await this.getAllArtistsTopTrackURIs(artistIDs);
            const tracks = this.compileAllArtistsTopTracksForPlaylist(topTrackLists);
            // make the description from the artists in the playlist
            const eventIDs = new Set(artistsWithIDs.map(artist => artist.eventID));
            const eventsForDescription = compiledEvents.filter(event => eventIDs.has(event.id));
            const playlistDescription = this.compileEventDescriptions(eventsForDescription);
            // create the final playlist
            const playlistID = await this.findOrCreateUserAppPlaylist(playlistDescription);
            await this.updatePlaylistTracks(playlistID, tracks);
            return playlistID;
        } catch (err) {
            console.log("something went wrong creating the Live Playlist", err);
        }
    }

    getPlaylistType(type) {
        switch (type) {
            case "private":
                return { public: false };
            case "collab":
                return { public: false, collaborative: true };
            case "public":
            default: 
                return { public: true };
        }
    }

    // save a copy of the playlist to the user's account
    async saveCopyOfPlaylist(playlistID, name, description, type) {
        let userSpotifyID = this.user.spotifyID;
        try {
            const oldPlaylistData = await this.userSpotifyAPI.ensureAccessToken(
                'getPlaylist', [playlistID, 
                { fields: "name,description,tracks.items(track(uri))" }]);

            name = name || oldPlaylistData.body.name;
            description = description || oldPlaylistData.body.description;
            type = this.getPlaylistType(type);
            const tracks = oldPlaylistData.body.tracks.items
                .map(trackItem => trackItem.track.uri);

            const newPlaylistData = await this.userSpotifyAPI.createPlaylist(
                userSpotifyID, name, { description, ...type });
            const newPlaylistID = newPlaylistData.body.id;
            console.log("new playlist:", newPlaylistID);
            
            await this.userSpotifyAPI.replaceTracksInPlaylist(newPlaylistID, tracks)
            console.log("we saved a copy of this playlist to your account!");
            return newPlaylistID;
        } catch (err) {
            console.log("something went wrong when trying to save a copy of this playlist", err);
        }
    }

}

/*
location search api request returns results of the form:
{
    "resultsPage": {
        "results": {
            "location": [
                {
                    "city": {
                        "displayName": the city name,
                        "country": { "displayName": the country name },
                        "state": { "displayName": the state name } (not necessarily included)
                    },
                    "metroArea": {
                        "id": metro area id used in event search,
                        "displayName": the metro area name,
                        "country": { "displayName": the country name },
                        "state": { "displayName": the state name } (not necessarily included)
                    }
                }
                ...possibly more location objs
            ]
        }
    }
}

event search api request returns results of the form:
{
    "resultsPage": {
        "results": {
            "event": [
                {
                    some event info I don't care about
                    "performance": [
                        {
                            "artist": {
                                "id": songkick id,
                                "displayName": name string,
                                "identifiers": [list of musicbrainz ids (because sometimes they're not sure what's right)]
                            }
                            some more performance info
                        },
                        ...possibly more perfomance objs
                    ]
                }
                ...possibly more event objs
            ]
        }
    }
}
*/

/*
artist search api request returns results of the form:
{
    "artists": {
        "items": [
            {
                "id": the artist's spotify ID,
                more artist info
            },
            ...some more artist objs
        ]
        some paging obj info
    }
}

top tracks api request returns results of the form:
{
    "tracks": [
        {
            "uri": the track's spotify URI,
            more track info
        },
        ...up to 9 more track objs
    ]
}
*/

module.exports = PlaylistCreator;
