import isEmpty from 'lodash.isempty';
import React from 'react';
import PlayPause from './PlayPause';
import SkipSeek from './SkipSeek';

const Player = (props) => {

    function getAlbumArt(playlistInfo) {
        if (playlistInfo && playlistInfo.images
             && playlistInfo.images[0] && playlistInfo.images[0].url) {
            return playlistInfo.images[0].url;
        } else {
            return null;
        }
    }

    return (
        <div className="player">
            <PlayPause isPlaying={props.isPlaying}
                    onClick={props.handlePlayPauseClick}
                    albumArt={getAlbumArt(props.playlistInfo)}/>
            <div className="player-info">
                {(!isEmpty(props.playingInfo)) ? 
                <div className="playing-info">
                    <h3>{props.playingInfo.name}</h3>
                    <h4>{props.playingInfo.artists
                    .map(artist => artist.name).join(", ")}</h4>
                </div>
                :
                <div className="playlist-info">
                    <h3>{props.playlistInfo.name}</h3>
                    <h4>{props.playlistInfo.owner.display_name}</h4>
                </div>
                }
                <SkipSeek onClick={props.handleSkipClick}/>
            </div>
            <a href={props.playlistInfo.external_urls.spotify}>
                <img src={'/images/spotify_logos/Spotify_Icon_RGB_White.svg'} 
                    alt="View this playlist on Spotify"
                    className="logo-link"/>
            </a>
        </div>
    );
}

export default Player;