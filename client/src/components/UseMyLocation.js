import React from 'react';
import Axios from 'axios';
import { trimLocation } from '../utils/LocationUtils';

const UseMyLocation = (props) => {

    async function handleClick() {
        try {
            let coords = await getGeoCoords();
            if (coords) {
                let location = await searchForGeoLocation(coords);
                props.recieveLocation(location)
            }
        } catch (err) {
            console.log("something went wrong getting the user's location", err);
        }
    }

    async function getGeoCoords() {
        try {
            let currPos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            let latLong = {
                lat: currPos.coords.latitude.toFixed(6),
                long: currPos.coords.longitude.toFixed(6)
            }
            return latLong;
        } catch (err) {
            console.log("couldn't get coords", err);
        }

    }

    async function searchForGeoLocation(coords) {
        try {
            let res = await Axios.get('/playlist/location', {
                params: {
                    location: `geo:${coords.lat},${coords.long}`
                }
            });
            return trimLocation(res.data.resultsPage.results.location[0]);
        } catch(err) {
            console.log("geolocation search failed", err);
        }
    }

    return (
        <div className="use-location"
            onClick={handleClick}>
            Use my location <i className="fa fa-map-marker"></i>
        </div>
    )
}

export default UseMyLocation;