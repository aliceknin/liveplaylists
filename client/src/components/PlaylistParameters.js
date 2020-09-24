import React, { useState, useContext } from 'react';
import '../styles/PlaylistParameters.scss';
import LocationSearch from './LocationSearch';
import axios from 'axios';
import LoginModal from './LoginModal';
import UserContext from '../contexts/UserContext';
import isEmpty from 'lodash.isempty';
import AlertModal from './AlertModal';
import LoadingButton from './LoadingButton';

const PlaylistParameters = (props) => {
    const { user, refreshUser } = useContext(UserContext);
    const [location, setLocation] = useState({});
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        if (loading) return;
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
        let playlistID = '';
        try {
            setLoading(true);
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
            } else {
                playlistID = res.data;
                console.log("created playlist!", playlistID);
                if (!user.playlistID) refreshUser();
            }
        } catch (err) {
            console.log("couldn't create playlist from parameters", err);
        } finally {
            setLoading(false);
            props.receivePlaylist(playlistID);
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
            <LoadingButton onClick={handleSubmit} loading={loading}>
                    {props.buttonText}
            </LoadingButton>
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