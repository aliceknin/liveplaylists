import React, { useEffect } from 'react';

const PlayPause = (props) => {

    useEffect(() => {
        // toggle playback with the API
    },[props.isPlaying]);

    return (
        <div className="play-pause">
            <img className="album-art" src={props.albumArt}
                alt="album art"/>
            <button className="play-btn"
                    name="Play/Pause Button" 
                    onClick={props.onClick}>
                {props.isPlaying ? 
                <i className="fa fa-pause"></i> :
                <i className="fa fa-play"></i>}
            </button>
        </div>
    );
}

export default PlayPause;