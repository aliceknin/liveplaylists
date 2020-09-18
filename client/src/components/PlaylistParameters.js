import React, { useState, useContext } from 'react';
import '../styles/PlaylistParameters.scss';
import LocationSearch from './LocationSearch';
import axios from 'axios';
import LoginModal from './LoginModal';
import UserProvider from '../contexts/UserProvider';
import isEmpty from 'lodash.isempty';
import AlertModal from './AlertModal';

const PlaylistParameters = (props) => {
    const user = useContext(UserProvider.context);
    const [location, setLocation] = useState({});
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

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
        if (isEmpty(user)) {
            setShowLoginModal(true);
            return;
        } if (isEmpty(location)){
            setAlertMessage("Try searching for a city first.");
            setShowAlert(true);
            return;
        }
        try {
            console.log("creating playlist from upcoming events in", location);
            const res = await axios.get('/playlist/create', {
                params: {
                    metroID: location.metroID
                }
            });
            if (res.data === "no events") {
                setAlertMessage(`We couldn't find any upcoming events` +
                ` in ${location.displayName}. Try somewhere else?`);
                setShowAlert(true);
                setLocation({});
            } else {
                let playlistID = res.data;
                console.log("created playlist!", playlistID);
                props.receivePlaylist(playlistID);
            }
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
            <LoginModal isOpen={showLoginModal} 
                        onHide={()=> setShowLoginModal(false)}/>
            <AlertModal isOpen={showAlert}
                        onHide={() => setShowAlert(false)}
                        label="Alert"
                        message={alertMessage}/>
        </div>
    );
}

export default PlaylistParameters;