import React, { useState } from 'react';
import '../styles/PlaylistParameters.scss';
import LocationSearch from './LocationSearch';
import axios from 'axios';

const PlaylistParameters = (props) => {
    const [location, setLocation] = useState({});

    async function handleSubmit() {
        switch (props.buttonText) {
            case "Create Playlist":
                await createPlaylistFromParameters();
                break;
            case "Save Playlist Parameters":
                savePlaylistParameters();
                break;
            default:
                console.log("you entered something weird for the button text" + 
                    " on a playlist parameters component. check that out.");
        }
    }

    async function createPlaylistFromParameters() {
        try {
            console.log("creating playlist from upcoming events in", location);
            const res = await axios.get('/playlist/create', {
                params: {
                    metroID: location.metroID
                }
            });
            let playlistID = res.data;
            console.log("created playlist!", playlistID);
            props.receivePlaylist(playlistID);
        } catch (err) {
            console.log("couldn't create playlist from parameters", err);
        }
    }

    function savePlaylistParameters() {
        // save the user's playlist settings to the database,
        // will be used on the user settings page
        console.log("saving playlist parameters... (not really)");
    }

    return (
        <div className="playlist-parameters">
            <div className="container">
                <LocationSearch setLocation={setLocation}/>
            </div>
            <button onClick={handleSubmit}>{props.buttonText}</button>
        </div>
    );
}

export default PlaylistParameters;