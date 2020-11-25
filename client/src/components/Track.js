import React from 'react';

const Track = (props) => {

    function timeInMinutes(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const leftoverSeconds = (seconds % 60)
            .toString().padStart(2, '0');
        return `${minutes}:${leftoverSeconds}`;
    }

    return (
        <li className="track" id={props.trackInd}>
            <div className="track-num">
                {props.trackInd + 1}
            </div>
            <div className="track-info">
                <h5 className="track-name">
                    {props.track.name}
                </h5>
                <h6 className="track-artist">
                    {props.track.artists
                    .map(artist => artist.name).join(", ")}
                </h6>
            </div>
            <div className="track-length">
                {timeInMinutes(props.track.duration_ms)}
            </div>
        </li>
    );
}

export default Track;