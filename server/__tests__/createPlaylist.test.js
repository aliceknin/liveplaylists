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