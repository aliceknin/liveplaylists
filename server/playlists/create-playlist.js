const spotifyAPI = require('../config/spotify');

/*
This is a sketch of all the functions I think I;ll need to 
create a plaulist. It is possible they should all return 
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

// reduce upcoming events to a list of artists
function getArtistsFromEvents(events) {
    return events.reduce((artistsSoFar, event) => {
        performances = event.performance;
        artistsToAdd = performances.map((performance) => {
            return performance.artist
        });
        return artistsSoFar.concat(artistsToAdd);
    }, [])
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
function getArtistSpotifyID(artist) {
    return spotifyAPI.searchArtists(artist.displayName)
    .then(data => {
        // extract the spotify ID from the first result
        return data.body.artists.items[0].id
    }).catch(err => {
        console.log(err.message);
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
            "id": the track's spotify ID,
            more track info
        },
        ...up to 9 more track objs
    ]
}
*/

// get the spotify IDs of each artist's top tracks
function getArtistTopTrackIDs(artistID) {
    return spotifyAPI.getArtistTopTracks(artistID)
    .then(data => {
        return data.body.tracks.map(track => track.id);
    }).catch(err => {
        console.log(err.message);
    });
}

// it's also possible that this should be programmatically generated to include something identifying the user
let playlistTitle = "some title that I should probably set elsewhere but I don't really know where yet"

// TODO: understand promises enough to make sure that this does what I want it to 
function createUserAppPlaylist() {
    return spotifyAPI.createPlaylist(playlistTitle)
    .then(data => {
        return data.body.id;
    }).then(playlistID => {
        return spotifyAPI.followPlaylist(playlistID, {'public' : false});
    }).then(data => {
        // TODO: figure out how to actually pass down the playlist ID while still returning the promise
        return spotifyAPI.changePlaylistDetails(playlistID, {'public' : false})
    }).then(data => {
        console.log('successfully created and followed a new app playlist!');
        return playlistID;
    }).catch(err => {
        console.log(err.message);
    })
}

// find or create playlist to modify
function findOrCreateUserAppPlaylist() {
    // ask the session if the logged in user has a playlist on the app spotify account
    // how do I get req.user? would it be terrible, terrible practice to attach it to the spotifyAPI object that gets cleared when I logout anyway?
    
    // if not, create a new playlist, make the user follow it, then make it private and collaborative
    return createUserAppPlaylist();
}

// figure out which tracks you're gonna add to playlist
function compileAllArtistsTopTracksForPlaylist(topTracks) {

}

// do all the above steps and then add the resulting list of tracks to the playlist

