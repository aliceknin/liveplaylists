const axios = require('axios');
const UserSpotifyAPI = require('../config/spotify');
const SpotifyUser = require('../models/spotifyUser');
const { getUpcomingEvents } = require('../services/songkickService');
const Constants = require('../config/constants');
const { joinWithCharLimit } = require('./utils');
const { getSpotifyIDFromWikiData } = require('../services/wikidataService');
const { getSpotifyIDFromMusicBrainzRelURL } = require('../services/musicbrainzService');

class PlaylistCreator {

    // Spotify API wrapper instance with the app Spotify account's credentials
    appSpotifyAPI = new UserSpotifyAPI()
                    .setRefreshTokenAndReturn(process.env.APP_REFRESH_TOKEN);

    constructor(user, access) {
        if (!user)  {
            throw new Error("can't create playlists without a user");
        }
        this.user = user;
        this.userSpotifyAPI = new UserSpotifyAPI(access, user)
    }

    filterEvents(events) {
        return events.filter(event => event.status === 'ok');
    }

    splitEvents(events) {
        const playlistEvents = 
            events.slice(0, Constants.INITIAL_EVENTS_PER_PLAYLIST)
        const rest = events.slice(Constants.INITIAL_EVENTS_PER_PLAYLIST);
        return [playlistEvents, rest];
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
                    mbids: performance.artist.identifier,
                    eventID: event.id
                }
            });
            return artistsSoFar.concat(artistsToAdd);
        }, []);
    }

    async getArtistSpotifyID(artist) {
        let spotifyID;
        if (artist.mbids[0]) {
            const mbid = artist.mbids[0].mbid;
            spotifyID = await getSpotifyIDFromWikiData(mbid);
            if (!spotifyID) {
                spotifyID = await getSpotifyIDFromMusicBrainzRelURL(mbid);
            }
        }
        if (!spotifyID) {
            spotifyID = await this.searchForArtistSpotifyID(artist.displayName);
        }
        return spotifyID;
    }

    // search spotify for each artist to find their spotify id
    async searchForArtistSpotifyID(artistDisplayName) {
        try {
            const data = await this.appSpotifyAPI.searchArtists(artistDisplayName);
            if (!data.body.artists.items[0]) {
                console.log("no results for", artistDisplayName);
                return "";
            }
            // extract the spotify ID from the first result
            let spotifyID = data.body.artists.items[0].id;
            console.log("got spotifyID from Spotify:", spotifyID);
            return spotifyID;
        } catch (err) {
            console.log("couldn't get artist spotify ID", err);
        }
    }

    async getAllArtistsSpotifyIDs(artists) {
        try {
            const artistsWithIDs = await Promise.all(
                artists.map(async (artist) => {
                    artist.spotifyID = await this.getArtistSpotifyID(artist);
                    return artist;
                })
            ); 
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
            const data = await this.appSpotifyAPI.getArtistTopTracks(
                artistID, 'from_token');
            return data.body.tracks.map(track => track.uri);
        } catch (err) {
            console.log("couldn't get artist top tracks", err);
        }
    }

    async getAllArtistsTopTrackURIs(artistsWithIDs) {
        const artistIDs = artistsWithIDs.map(artist => artist.spotifyID);
        const artistIDSet = new Set(artistIDs);
        const uniqueArtistIDs = Array.from(artistIDSet);
        let foundTracklessArtist = false;
        
        const topTrackLists = await Promise.all(uniqueArtistIDs.map(
            async (artistID) => {
                const topTracks = await this.getArtistTopTrackURIs(artistID);
                if (topTracks.length === 0) {
                    foundTracklessArtist = true;
                    artistIDSet.delete(artistID);
                    console.log("no tracks for artist with ID", artistID);
                }
                return topTracks;
            }));

        const artistsWithTracks = foundTracklessArtist ? 
            artistsWithIDs.filter(artist => artistIDSet.has(artist.spotifyID)) : 
            artistsWithIDs;

        return [topTrackLists, artistsWithTracks];
    }

    // figure out which tracks you're gonna add to playlist
    compileAllArtistsTopTracksForPlaylist(topTrackLists) {
        const tracks = topTrackLists.reduce((tracksSoFar, trackList) => {
            const tracksToAdd = trackList.slice(0, Constants.TRACKS_PER_ARTIST);
            return tracksSoFar.concat(tracksToAdd);
        }, []);
        const uniqueTracks = Array.from(new Set(tracks));
        return uniqueTracks;
    }

    getEventDescription(event) {
        return event.displayName;
    }

    compileEventDescriptions(events) {
        const descriptions = events.map(this.getEventDescription);

        // compile description while respecting the character limit
        const characterLimit = 512;
        const separator = ' | ';
        const defaultDescription = Constants.APP_PLAYLIST_DESCRIPTION;
        const playlistDescription = joinWithCharLimit(
            characterLimit, descriptions, separator, defaultDescription);

        return playlistDescription;
    }

    async updatePlaylistDescription(playlistID, description) {
        try {
            return await this.appSpotifyAPI.ensureAccessToken(
                'changePlaylistDetails', 
                [ playlistID, { description } ]);
        } catch (err) {
            console.log("couldn't update the description", err)
        }
    }

    async createUserAppPlaylist(description) {
        // it's also possible that the playlist title should be programmatically generated to include something identifying the user
        // something like "Coming To You Live" (but I don't know how I'd identify the user)
        description = description || '';
        try {
            // we want to allow the user to modify this themselves
            const data = await this.appSpotifyAPI.ensureAccessToken(
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

    // add the resulting list of tracks to the playlist
    // spotify only allows you to replace/add 100 tracks at a time
    async updatePlaylistTracks(playlistID, tracks, spotifyAPI) {
        try {
            for (let i = 0; i < tracks.length; i += 100) {
                let trimmedTracks = tracks.slice(i, i + 100);
                if (i === 0) {
                    await spotifyAPI.ensureAccessToken(
                        'replaceTracksInPlaylist', 
                        [ playlistID, trimmedTracks ]);
                        console.log("added tracks!");
                }
                else {
                    await spotifyAPI.addTracksToPlaylist(
                        playlistID, trimmedTracks
                    );
                    console.log("added even more tracks!");
                }
            }
        } catch (err) {
            console.log("couldn't update playlist tracks", err);
        };
    }
            // separate out the events we want to use for the playlist
            // get list of objects with artist display names and their event ids
            // add spotify ids to objects
            // make the tracklist from the spotify artists,
            // filter artists to only those we found tracks for

    async collectTracks(events) {
        let trackSet = new Set();
        let artistList = [];
        let eventList = [];
        let eventsToAdd = this.filterEvents(events);
        while(trackSet.size < Constants.MIN_TRACKS && eventsToAdd.length > 0) {
            const [playlistEvents, rest] = this.splitEvents(eventsToAdd);
            const artistsWithEvents = this.getArtistsFromEvents(playlistEvents);
            const artistsWithIDs = await this.getAllArtistsSpotifyIDs(artistsWithEvents);
            const [topTrackLists, artistsWithTracks] = 
                await this.getAllArtistsTopTrackURIs(artistsWithIDs);
            const tracks = this.compileAllArtistsTopTracksForPlaylist(topTrackLists);

            tracks.forEach(track => trackSet.add(track));
            artistList = artistList.concat(artistsWithTracks);
            eventList = eventList.concat(playlistEvents);
            eventsToAdd = rest;
        }
        const trackList = Array.from(trackSet);
        return [trackList, artistList, eventList];
    }

    getPlaylistDescription(eventList, artistList) {
        const eventIDs = new Set(artistList.map(artist => artist.eventID));
        const eventsForDescription = eventList.filter(event => eventIDs.has(event.id));
        return this.compileEventDescriptions(eventsForDescription);
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

            // ensure access token explicitly because the first thing we call is a function 
            // that 1) doesn't always call on the spotify api and 2) is executed multiple 
            // times in parallel, and we don't want to call ensure access token like that
            await this.appSpotifyAPI.ensureAccessToken();

            // get a tracklist, those tracks' artists, and the events from which the tracklist was created
            const [trackList, artistList, eventList] = await this.collectTracks(events);
            
            // make the description from the artists that have tracks in the playlist
            const playlistDescription = this.getPlaylistDescription(eventList, artistList);

            // create the final playlist
            const playlistID = await this.findOrCreateUserAppPlaylist(playlistDescription);
            await this.updatePlaylistTracks(playlistID, trackList, this.appSpotifyAPI);

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

    async getAllItemsFromPagingObject(items, next, itemfields) {
        try {
            await this.appSpotifyAPI.ensureAccessToken();
            while (next) {
                const nextData = await axios.get(next + 
                    "&fields=next,items" + itemfields, {
                    headers: {
                        'Authorization': `Bearer ${this.appSpotifyAPI.getAccessToken()}`
                    }
                });
    
                items = items.concat(nextData.data.items);
                next = nextData.data.next;
            }
        } catch (err) {
            console.log("something went wrong getting more items from paging obj", err);
        } finally {
            return items;
        }
    }

    // save a copy of the playlist to the user's account
    async saveCopyOfPlaylist(playlistID, name, description, type) {
        let userSpotifyID = this.user.spotifyID;
        try {
            const itemFields = "(track(uri))";
            const oldPlaylistData = await this.userSpotifyAPI.ensureAccessToken(
                'getPlaylist', [playlistID, 
                { fields: "name,description,tracks(items" + itemFields + ',next)' }]);

            name = name || oldPlaylistData.body.name;
            description = description || oldPlaylistData.body.description;
            type = this.getPlaylistType(type);
            const allTracks = await this.getAllItemsFromPagingObject(
                oldPlaylistData.body.tracks.items,
                oldPlaylistData.body.tracks.next,
                itemFields
            );
            const trackURIs = allTracks.map(trackItem => trackItem.track.uri);

            const newPlaylistData = await this.userSpotifyAPI.createPlaylist(
                userSpotifyID, name, { description, ...type });
            const newPlaylistID = newPlaylistData.body.id;
            console.log("new playlist:", newPlaylistID);
            
            await this.updatePlaylistTracks(newPlaylistID, trackURIs, this.userSpotifyAPI);
            console.log("we saved a copy of this playlist to your account!");
            return newPlaylistID;
        } catch (err) {
            console.log("something went wrong when trying to save a copy of this playlist", err);
        }
    }

    async getPlaylistInfo(playlistID) {
        const itemFields = "(track(name,uri,duration_ms,artists(name)))";
        const playlistData = await this.appSpotifyAPI.ensureAccessToken(
            'getPlaylist', [playlistID,
            { fields: "name,description,href,images," +
            "tracks(items" + itemFields + ",next)" }]
        );
        const tracks = playlistData.body.tracks;
        const items = await this.getAllItemsFromPagingObject(
            tracks.items, tracks.next, itemFields)
        const playlist = {
            ...playlistData.body,
            tracks: {
                items: items
            }
        }

        return playlist;
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
