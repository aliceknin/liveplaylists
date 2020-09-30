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
                <button onClick={()=> setPlaylistID("")}>
                    Create New Playlist
                </button>
                <button onClick={() => setSaveModalOpen(true)}>
                    Save Playlist
                </button>
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