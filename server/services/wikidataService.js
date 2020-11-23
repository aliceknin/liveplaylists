const wdk = require('wikidata-sdk');
const axios = require('axios');

async function getSpotifyIDFromWikiData(mbid) {
    const sparql = `
        SELECT ?spotifyId WHERE {
            ?musician wdt:P434 "${mbid}";
                    wdt:P1902 ?spotifyId.
        }`;
    const url = wdk.sparqlQuery(sparql);

    try {
        const wdkRes = await axios.get(url);
        const idContainer = wdk.simplify.sparqlResults(
            wdkRes.data, { minimize: true });
        const spotifyID = idContainer[0] ? idContainer[0] : '';
        if (spotifyID) 
        console.log("got spotifyID from WikiData:", spotifyID);
        return spotifyID;
    } catch (err) {
        console.log("couldn't get spotify id from mbid", err);
    }
}

module.exports = { getSpotifyIDFromWikiData };
