const { MusicBrainzApi } = require('musicbrainz-api');

const mbApi = new MusicBrainzApi({
    appName: "liveplaylists",
    appVersion: "0.1.0",
    appContactInfo: "liveplaylistsapp@gmail.com"
});

async function getSpotifyIDFromMusicBrainzRelURL(mbid) {
    try {
        const artist = await mbApi.getArtist(mbid, [ 'url-rels' ]);
        const relURLs = artist.relations;
    
        for (relURL of relURLs) {
            if (relURL.type === "free streaming") {
                maybeSpotifyURL = relURL.url.resource;
                spotifyBaseURL = "https://open.spotify.com/artist/"
                if (maybeSpotifyURL.includes(spotifyBaseURL)) {
                    const spotifyID = maybeSpotifyURL.slice(spotifyBaseURL.length);
                    console.log("got spotifyID from MusicBrainz:", spotifyID);
                    return spotifyID;
                }
            }
        }
    
        return '';
    } catch (err) {
        console.log("couldn't get spotify id from rel urls", err);
    }
}

module.exports = { mbApi, getSpotifyIDFromMusicBrainzRelURL };