const PlaylistCreator = require("../playlists/createPlaylist");

test("should get a flat list of artist objects from a list of events", () => {
    let events = [
        {
            "displayName": "Event 1",
            "status": "ok",
            "performance": [
                {
                    "artist": {
                        "id": "songkick id 1",
                        "displayName": "Alice",
                        "identifiers": ["list of musicbrainz ids (because sometimes they're not sure what's right)"]
                    }
                },
                {
                    "artist": {
                        "id": "songkick id 2",
                        "displayName": "Bob",
                        "identifiers": ["list of musicbrainz ids (because sometimes they're not sure what's right)"]
                    }
                },
            ]
        },
        {
            "displayName": "Event 2",
            "status": "cancelled",
            "performance": [
                {
                    "artist": {
                        "id": "songkick id 3",
                        "displayName": "Carol",
                        "identifiers": ["list of musicbrainz ids (because sometimes they're not sure what's right)"]
                    }
                },
                {
                    "artist": {
                        "id": "songkick id 4",
                        "displayName": "Donovan",
                        "identifiers": ["list of musicbrainz ids (because sometimes they're not sure what's right)"]
                    }
                },
            ]
        },
        {
            "displayName": "Event 3",
            "status": "postponed",
            "performance": [

                {
                    "artist": {
                        "id": "songkick id 4",
                        "displayName": "Eddy",
                        "identifiers": ["list of musicbrainz ids (because sometimes they're not sure what's right)"]
                    }
                },
            ]
        },
        {
            "displayName": "Event 4",
            "status": "ok",
            "performance": [

                {
                    "artist": {
                        "id": "songkick id 4",
                        "displayName": "Fantasia",
                        "identifiers": ["list of musicbrainz ids (because sometimes they're not sure what's right)"]
                    }
                },
            ]
        },
        {
            "displayName": "Event 5",
            "status": "ok",
            "performance": [

                {
                    "artist": {
                        "id": "songkick id 4",
                        "displayName": "Gwendolyn",
                        "identifiers": ["list of musicbrainz ids (because sometimes they're not sure what's right)"]
                    }
                },
            ]
        },
        {
            "displayName": "Event 6",
            "status": "ok",
            "performance": [

                {
                    "artist": {
                        "id": "songkick id 4",
                        "displayName": "Heath",
                        "identifiers": ["list of musicbrainz ids (because sometimes they're not sure what's right)"]
                    }
                },
            ]
        }
        
    ]

    let user = {
        name: 'Alice Nin',
        spotifyID: '12140404407'
    }

    let pc = new PlaylistCreator(user);

    let artists = ["Alice", "Bob", "Carol", "Donovan", "Eddy", "Fantasia", "Gwendolyn", "Heath"];
    // let descriptions = ["Event 1", "Event 2", "Event 3", "Event 4", "Event 5", "Event 6"];
    let artistsFromEvents = pc.getArtistsFromEvents(events);

    expect(artistsFromEvents.map(artist => artist.displayName)).toEqual(artists);
    // expect(descriptionsFromEvents).toEqual(descriptions);

    let compiledEventNames = ["Event 1", "Event 4", "Event 5"];
    let compiledEvents = pc.compileEventsForPlaylist(events);
    expect(compiledEvents.map(event => event.displayName)).toEqual(compiledEventNames);
});

/* 
Situations I'd like to test:

Events to include:
 - doesn't include events from the past
 - doesn't include events that have been cancelled or postponed

CreateLivePlaylist: 
 - if there are no events, it should immediately return
   without trying to continue, but shouldn't throw an error
 - if the spotify api can't find a spotify id or top tracks,
   those functions should return something that can be iterated
   over seamlessly (an empty version of the expected type)
 - none of the map functions error if they come across an 
   empty element of whatever they're iterating over
 - if it errors on anything that prevents a playlist from 
   being created or any tracks being added, it should stop
   and not try to continue (so don't catch errors that you
   actually want to stop execution)

Auth:
 - never fails because of an auth error (how do I test this?
   I suppose I gotta make this condition more specific)
 - never calls ensureAccessToken multiple times simultaneously

Description:
 - when an artist's spotify ID can't be found
        if their associated event features only them,
            it shouldn't appear in the description
        but if it features other artists who have spotify
        IDs and tracks
            it should appear in the description
 - when an artist has a spotify ID but has no top tracks
        if their associated event features only them, 
            it shouldn't appear in the description
        but if it features other artists who have spotify
        IDs and tracks
            it should appear in the description
 - when an artist appears at two separate events
        both events should appear in the description, unless...
 - when an artist has two shows (with the same support?) 
   at the same location on different days
        the description combines those events into a single
        event description?

*/