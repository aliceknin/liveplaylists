import React, { useState } from 'react';
import '../styles/PlaylistParameters.scss';
import LocationSearch from './LocationSearch';

const PlaylistParameters = (props) => {
    const [location, setLocation] = useState({});

    function handleSubmit() {
        switch (props.buttonText) {
            case "Create Playlist":
                createPlaylistFromParameters();
                break;
            case "Save Playlist Parameters":
                savePlaylistParameters();
                break;
            default:
                console.log("you entered something weird for the button text" + 
                    " on a playlist parameters component. check that out.");
        }
    }

    function createPlaylistFromParameters() {
        // create playlist with spotify and bandsintown APIs
        // (which will probably be separated out into multiple 
        // separate methods when I figure out what I'm doing)
        console.log("creating playlist from upcoming events in", location);
        props.receivePlaylist("7GOJYqyQqCUz4fyfvHb13L");
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