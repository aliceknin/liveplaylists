import React, { useState } from 'react';
import '../styles/SpotifyEmbed.scss';

const SpotifyEmbed = (props) => {

    const baseUrl = 'https://open.spotify.com/embed/playlist/';
    const url = baseUrl + props.playlistID;
    const baseClassName = "spotify-embed";

    const [src, setSrc] = useState(url);
    const [loading, setLoading] = useState(true);
    const [className, setClassName] = useState(baseClassName);

    function forceRefresh() {
        hideIframe();
        setSrc(url + "?frame_id=" + Date.now().toString());
    }

    function showIframe() {
        setClassName(baseClassName + " loaded");
        setLoading(false);
    }

    function hideIframe() {
        setClassName(baseClassName);
        setLoading(true);
    }

    return (
        <div className="spotify-embed-container">
            {loading && 
            <div className="loading">
                <p>Loading<span>.</span><span>.</span><span>.</span></p>
            </div>}
            <iframe src={src}
                title="Spotify Playlist"
                className={className}
                frameBorder="0"
                allowtransparency="true"
                allow="encrypted-media"
                onLoad={showIframe}>
            </iframe>
            <button onClick={forceRefresh}
                    className="refresh">
                        <i className="fa fa-refresh"></i>
            </button>
        </div>
    )
}

export default SpotifyEmbed;