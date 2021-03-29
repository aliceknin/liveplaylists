import React, { useState } from 'react';
import Axios from 'axios';
import { trimLocation } from '../utils/LocationUtils';
import BannerAlert from './BannerAlert';

const defaultErrorMessage = "Something went wrong getting your location.";

const UseMyLocation = (props) => {
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(defaultErrorMessage);
    const [locationBlocked, setLocationBlocked] = useState(false);

    async function handleClick() {
        try {
            let coords = await getGeoCoords();
            if (coords) {
                let location = await searchForGeoLocation(coords);
                props.recieveLocation(location)
            }
        } catch (err) {
            setShowError(true);
            setErrorMessage(defaultErrorMessage);
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
            setShowError(true);
            console.log("couldn't get coords", err);

            if (err.code === err.PERMISSION_DENIED) {
                setLocationBlocked(true);
                setErrorMessage("You've blocked this site from getting your location.");
            } else { 
                setErrorMessage(defaultErrorMessage);
            }
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
            setShowError(true);
            setErrorMessage(defaultErrorMessage);
            console.log("geolocation search failed", err);
        }
    }

    return (
        <>
        <div className={`use-location ${locationBlocked ? "location-blocked" : ""}`}
            onClick={handleClick}>
            <span>Use my location <i className="fa fa-map-marker"></i></span>
        </div>
        {showError &&
            <BannerAlert 
                onClose={() => setShowError(false)} 
                className="error"
                duration="25000000">
                {errorMessage}
            </BannerAlert>}
        </>
    )
}

export default UseMyLocation;