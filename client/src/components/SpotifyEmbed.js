import React from 'react';
import '../styles/SpotifyEmbed.scss';

const SpotifyEmbed = (props) => {

    // in theory, creating a unique name on an iframe 
    // prevents caching, so it will always have up to date
    // content (which is very important as changing the
    // content of a playlist is literally the point of this)
    // see https://stackoverflow.com/questions/2648053/preventing-iframe-caching-in-browser

    return (
        <div className="spotify-embed-container">
            <iframe src={`https://open.spotify.com/embed/playlist/${props.playlistID}`}
                title="Spotify Playlist"
                name={"Spotify Playlist" + Date.now().toString()}
                className="spotify-embed"
                frameBorder="0"
                allowtransparency="true"
                allow="encrypted-media">
            </iframe>
        </div>
    )
}

export default SpotifyEmbed;