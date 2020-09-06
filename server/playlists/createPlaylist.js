const { appSpotifyAPI } = require('../config/spotify');
const SpotifyUser = require('../models/spotifyUser');

/*
This is a sketch of all the functions I think I'll need to 
create a playlist. It is possible they should all return 
promises (or at least the ones that make api calls should).
*/ 

// get the location to search

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
*/

// get the dates to search

// search songkick for upcoming events

/*
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

// reduce upcoming events to a list of artist objects
function getArtistsFromEvents(events) {
    if (!events) {
        return;
    }
    return events.reduce((artistsSoFar, event) => {
        performances = event.performance;
        artistsToAdd = performances.map((performance) => {
            return performance.artist;
        });
        return artistsSoFar.concat(artistsToAdd);
    }, []);
}

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
*/

// search spotify for each artist to find their spotify id
function getArtistSpotifyID(artist, userSpotifyAPI) {
    return userSpotifyAPI.searchArtists(artist.displayName)
    .then(data => {
        // extract the spotify ID from the first result
        console.log(data);
        return data.body.artists.items[0].id
    }).catch(err => {
        console.log("couldn't get artist spotify ID", err);
    });
}

function getArtistsSpotifyIDs(artists) {
    return artists.map(getArtistSpotifyID(artist));
}

/*
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

// get the spotify URIs of each artist's top tracks
function getArtistTopTrackURIs(artistID, userSpotifyAPI) {
    return userSpotifyAPI.getArtistTopTracks(artistID, 'from_token')
    .then(data => {
        return data.body.tracks.map(track => track.uri);
    }).catch(err => {
        console.log("couldn't get artist top tracks", err);
    });
}

// it's also possible that this should be programmatically generated to include something identifying the user
// something like "Coming To You Live" (but I don't know how I'd identify the user)
let playlistTitle = "is there a goddess of http requests"

// TODO: understand promises enough to make sure that this does what I want it to 
function createUserAppPlaylist(userSpotifyAPI) {
    let playlistID;
    return appSpotifyAPI.ensureAccessToken("createPlaylist", [ "f7g1xafjiium3d86aeul8q8il", playlistTitle ])
    .then(data => {
        console.log("we tried to create a playlist");
        playlistID = data.body.id 
        return data.body.id;
    }).then(playlistID => {
        console.log('trying to follow the playlist...');
        return userSpotifyAPI.followPlaylist(playlistID, 
            {'public' : false});
    }).then(() => {
        // we want to allow the user to modify this themselves
        console.log('trying to make the playlist collaborative...'); 
        return appSpotifyAPI.changePlaylistDetails(playlistID, 
            {'public' : false, 'collaborative' : true });
    }).then(() => {
        console.log('trying to update the database...');
        // we also need to update the user's playlistID in the database
        SpotifyUser.findOneAndUpdate(
            { spotifyID: userSpotifyAPI.user.spotifyID }, 
            { $set: { playlistID } })
    }).then(() => {
        console.log('successfully created and followed a new app playlist!');
        return playlistID;
    }).catch(err => {
        console.log("something went wrong while trying to create a playlist", err);
    }); 
    
}

// find or create playlist to modify (returns the playlist ID)
async function findOrCreateUserAppPlaylist(userSpotifyAPI) {
    if (userSpotifyAPI.user) {
        if (userSpotifyAPI.user.playlistID) {
            return userSpotifyAPI.user.playlistID
        } else {
            return await createUserAppPlaylist(userSpotifyAPI);
        }
    } else {
        throw new Error("can't get a playlist without a user");
    }
}

// figure out which tracks you're gonna add to playlist
function compileAllArtistsTopTracksForPlaylist(topTracks) {

}

// do all the above steps and then add the resulting list of tracks to the playlist

function updateUserAppPlaylist(playlistID, tracks) {
    console.log("trying to update the playlist", playlistID);
    console.log("with tracks", tracks);
    appSpotifyAPI.ensureAccessToken('replaceTracksInPlaylist', [
        playlistID,
        tracks
    ]).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
}

function saveCopyOfPlaylist(playlistID, userSpotifyAPI) {
    let name;
    let description;
    let tracks;
    let newPlaylistID;
    let userSpotifyID = userSpotifyAPI.user.spotifyID;
    return userSpotifyAPI.getPlaylist(playlistID, 
        { fields: "name,description,tracks.items(track(uri))" })
    .then(data => {
        name = data.body.name;
        description = data.body.description;
        tracks = data.body.tracks.items
                 .map(trackItem => trackItem.track.uri);
        return { name, description, tracks };
    }).then(() => {
        return userSpotifyAPI.createPlaylist(userSpotifyID, name, { description })
    }).then(data => {
        newPlaylistID = data.body.id;
        console.log("new playlist:", newPlaylistID);
        return userSpotifyAPI.replaceTracksInPlaylist(newPlaylistID, tracks)
    }).then(() => {
        console.log("we saved a copy of this playlist to your account!");
        return newPlaylistID;
    }).catch(err => {
        console.log("something went wrong when trying to save a copy of this playlist", err);
    });
}

module.exports = { 
    getArtistsFromEvents,
    getArtistSpotifyID,
    getArtistsSpotifyIDs,
    getArtistTopTrackURIs,
    createUserAppPlaylist,
    findOrCreateUserAppPlaylist,
    updateUserAppPlaylist,
    saveCopyOfPlaylist
 };
