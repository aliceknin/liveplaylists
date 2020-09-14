import React from 'react';
import '../styles/SpotifyEmbed.scss';

const SpotifyEmbed = (props) => {

    return (
        <div className="spotify-embed-container">
            <iframe src={`https://open.spotify.com/embed/playlist/${props.playlistID}`}
                title="Spotify Playlist" 
                className="spotify-embed"
                frameBorder="0" 
                allowtransparency="true" 
                allow="encrypted-media">
            </iframe>
        </div>
    )
}

export default SpotifyEmbed;