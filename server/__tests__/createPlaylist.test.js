const PlaylistCreator = require("../playlists/createPlaylist");

test("should get a flat list of artist objects from a list of events", () => {
    let events = [
        {
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

    let artists = ["Alice", "Bob", "Carol", "Donovan"];
    let artistsFromEvents = PlaylistCreator.getArtistsFromEvents(events);

    expect(artistsFromEvents.map(artist => artist.displayName)).toEqual(artists);
});