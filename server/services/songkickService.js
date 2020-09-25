const axios = require('axios');

/*
Songkick API request URLs

Location search:
    https://api.songkick.com/api/3.0/search/locations.json?query={search_query}&apikey={your_api_key}
Metro Area Calendar search:
    https://api.songkick.com/api/3.0/metro_areas/{metro_area_id}/calendar.json?apikey={your_api_key}
*/

const songkickAxios = axios.create({ baseURL: 'https://api.songkick.com/api/3.0/' });

async function searchForLocation(query) {
    try {
        const res = await songkickAxios.get('search/locations.json', {
            params: {
                ...query,
                apikey: process.env.SONGKICK_API_KEY
            }
        })
        return res.data;
    } catch (err) {
        console.log('something went wrong with the songkick api location search', err);
    }
}

async function getUpcomingEvents(query) {
    try {
        if (!query || !query.metroID) {
            throw new Error("can't get events without a metroID");
        }
        const d = getDefaultDateRange();
        query.min_date = query.min_date || d.min_date;
        query.max_date = query.max_date || d.max_date;
        const res = await songkickAxios.get(`metro_areas/${query.metroID}/calendar.json`, {
            params: {
                ...query,
                apikey: process.env.SONGKICK_API_KEY
            }
        })
        return res.data;
    } catch (err) {
        console.log('something went wrong with the songkick api event search', err);
    }
}

function getDefaultDateRange() {
    const today = new Date();
    const max_day = new Date(
        today.getFullYear() + 5, 
        today.getMonth(), 
        today.getDate()
    );
    return {
        min_date: today.toISOString().substring(0, 10),
        max_date: max_day.toISOString().substring(0, 10)
    }
}

module.exports = { searchForLocation, getUpcomingEvents };