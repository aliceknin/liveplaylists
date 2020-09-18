const PlaylistCreator = require("../playlists/createPlaylist");

test("should get a flat list of artist objects from a list of events", () => {
    let events = [
        {
            "displayName": "Event 1",
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
        
    ]

    let user = {
        name: 'Alice Nin',
        spotifyID: '12140404407'
    }

    let pc = new PlaylistCreator(user);

    let artists = ["Alice", "Bob", "Carol", "Donovan"];
    let descriptions = ["Event 1", "Event 2"];
    let [artistsFromEvents, descriptionsFromEvents] = 
        pc.getArtistsAndDescriptionsFromEvents(events);

    expect(artistsFromEvents.map(artist => artist.displayName)).toEqual(artists);
    expect(descriptionsFromEvents).toEqual(descriptions);
});