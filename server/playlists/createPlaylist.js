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
                return performance.artist;
            });
            return artistsSoFar.concat(artistsToAdd);
        }, []);
    }

    // search spotify for each artist to find their spotify id
    getArtistSpotifyID(artist) {
        return this.userSpotifyAPI.ensureAccessToken(
            'searchArtists', [artist.displayName])
        .then(data => {
            // extract the spotify ID from the first result
            if (!data.body.artists.items[0]) {
                console.log("no results for", artist.displayName);
                return "";
            }
            return data.body.artists.items[0].id
        }).catch(err => {
            console.log("couldn't get artist spotify ID", err);
        });
    }

    getAllArtistsSpotifyIDs(artists) {
        return Promise.all(artists.map((artist) => 
            this.getArtistSpotifyID(artist)));
    }

    // get the spotify URIs of each artist's top tracks
    getArtistTopTrackURIs(artistID) {
        if (!artistID) {
            return [];
        }
        return this.userSpotifyAPI.ensureAccessToken(
        'getArtistTopTracks', [artistID, 'from_token'])
        .then(data => {
            return data.body.tracks.map(track => track.uri);
        }).catch(err => {
            console.log("couldn't get artist top tracks", err);
        });
    }

    getAllArtistsTopTrackURIs(artistIDs) {
        return Promise.all(artistIDs.map((artistID) => 
            this.getArtistTopTrackURIs(artistID)));
    }

    createUserAppPlaylist() {
        // it's also possible that the playlist title should be programmatically generated to include something identifying the user
        // something like "Coming To You Live" (but I don't know how I'd identify the user)
        let playlistID;
        return appSpotifyAPI.ensureAccessToken(
        'createPlaylist', [Constants.APP_SPOTIFY_ID, Constants.PLAYLIST_TITLE])
        .then(data => {
            console.log("we tried to create a playlist");
            playlistID = data.body.id 
            return data.body.id;
        }).then(playlistID => {
            console.log('trying to follow the playlist...');
            return this.userSpotifyAPI.ensureAccessToken(
            'followPlaylist', [playlistID, {'public' : false}]);
        }).then(() => {
            // we want to allow the user to modify this themselves
            console.log('trying to make the playlist collaborative...'); 
            return appSpotifyAPI.changePlaylistDetails(playlistID, 
                {'public' : false, 'collaborative' : true });
        }).then(() => {
            console.log('trying to update the database...');
            // we also need to update the user's playlistID in the database
            return SpotifyUser.findOneAndUpdate(
                { spotifyID: this.user.spotifyID }, 
                { $set: { playlistID } })
        }).then(() => {
            console.log('successfully created and followed a new app playlist!');
            return playlistID;
        }).catch(err => {
            console.log("something went wrong while trying to create a playlist", err);
        }); 
    }

    // find or create playlist to modify (returns the playlist ID)
    async findOrCreateUserAppPlaylist() {
        if (this.user.playlistID) {
            return this.user.playlistID;
        } else {
            return await this.createUserAppPlaylist();
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

    // add the resulting list of tracks to the playlist
    updatePlaylist(playlistID, tracks) {
        return appSpotifyAPI.ensureAccessToken(
            'replaceTracksInPlaylist', [playlistID, tracks]
        ).then(() => {
            console.log("added tracks!");
        }).catch(err => {
            console.log(err);
        });
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
            // this is me trimming the list of artists
            // so we don't hit the spotify api rate limits
            const artists = this.getArtistsFromEvents(events)
                .slice(0, Constants.INITIAL_ARTISTS_PER_PLAYLIST);
            const artistIDs = await this.getAllArtistsSpotifyIDs(artists);
            const uniqueArtistIDs = Array.from(new Set(artistIDs));
            const topTrackLists = await this.getAllArtistsTopTrackURIs(uniqueArtistIDs);
            const tracks = this.compileAllArtistsTopTracksForPlaylist(topTrackLists);
            const playlistID = await this.findOrCreateUserAppPlaylist();
            await this.updatePlaylist(playlistID, tracks);
            return playlistID;
        } catch (err) {
            console.log("something went wrong creating the Live Playlist", err);
        }
    }

    // save a copy of the playlist to the user's account
    saveCopyOfPlaylist(playlistID, name, description) {
        let tracks;
        let newPlaylistID;
        let userSpotifyID = this.user.spotifyID;
        return this.userSpotifyAPI.ensureAccessToken(
            'getPlaylist', [playlistID, 
            { fields: "name,description,tracks.items(track(uri))" }])
        .then(data => {
            name = name || data.body.name;
            description = description || data.body.description;
            tracks = data.body.tracks.items
                     .map(trackItem => trackItem.track.uri);
            return { name, description, tracks };
        }).then(() => {
            return this.userSpotifyAPI.createPlaylist(userSpotifyID, name, { description })
        }).then(data => {
            newPlaylistID = data.body.id;
            console.log("new playlist:", newPlaylistID);
            return this.userSpotifyAPI.replaceTracksInPlaylist(newPlaylistID, tracks)
        }).then(() => {
            console.log("we saved a copy of this playlist to your account!");
            return newPlaylistID;
        }).catch(err => {
            console.log("something went wrong when trying to save a copy of this playlist", err);
        });
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
