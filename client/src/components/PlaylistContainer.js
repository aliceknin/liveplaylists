import React, { useState } from 'react';
import SavePlaylistModal from '../components/SavePlaylistModal';
import PlaylistParameters from '../components/PlaylistParameters';
import SpotifyEmbed from '../components/SpotifyEmbed';
import useStateWithSessionStorage from '../hooks/useStateWithSessionStorage';

const PlaylistContainer = () => {
    const [playlistID, setPlaylistID] = useStateWithSessionStorage('playlistID', '');
    const [saveModalOpen, setSaveModalOpen] = useState(false);

    return (
        playlistID ? 
            <>
            <SpotifyEmbed playlistID={playlistID}/>
            <div className="buttons-container">
                <div className="info-popup-group">
                    <button onClick={()=> setPlaylistID("")} className="info-popup-cue">
                        Create New Playlist
                    </button>
                    <aside className="info-popup">
                        <p>Override this playlist with a new one.</p> 
                        <p>If you want to keep this playlist, save a copy of this playlist first, then create a new one.</p>
                    </aside>
                </div>
                <div className="info-popup-group">
                    <button onClick={() => setSaveModalOpen(true)} className="info-popup-cue">
                        Save Playlist
                    </button>
                    <aside className="info-popup">
                        <p>Save a copy of this playlist to your Spotify account.</p>
                        <p>This playlist is currently shared with your Spotify account, but will be overwritten any time you create a new playlist.</p>
                    </aside>
                </div>
            </div>
            <SavePlaylistModal playlistID={playlistID}
                isOpen={saveModalOpen}
                onHide={() => setSaveModalOpen(false)}/>
            </>
            :
            <PlaylistParameters buttonText="Create Playlist" 
                receivePlaylist={(id) => setPlaylistID(id)}/>
    );
}

export default PlaylistContainer;