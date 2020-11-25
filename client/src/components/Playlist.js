import React, { useState, useEffect } from 'react';
import axios from 'axios';
import isEmpty from 'lodash.isempty';

import Player from './Player';
import Track from './Track';

import '../styles/Playlist.scss'

const Playlist = (props) => {
    const [currentTrackInd, setCurrentTrackInd] = useState(null);
    const [tracks, setTracks] =  useState([]);
    const [playlistInfo, setPlaylistInfo] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        async function fetchInfo(playlistID) {
            try {
                const res = await axios.get('/playlist/info', {
                    params: {
                        playlistID
                    }
                });
                const fetchedInfo = res.data;

                setTracks(fetchedInfo.tracks);
                delete fetchedInfo.tracks;
                setPlaylistInfo(fetchedInfo);
            } catch (err) {
                console.log("couldn't get playlist info", err);
            }
        }
        fetchInfo(props.playlistID);
    }, [props.playlistID]);

    function playTrack(i) {
        if (tracks[i]) {
            // somehow play tracks[i] with the sdk
            // if it works,
            setCurrentTrackInd(i);
            setIsPlaying(true);
        } else {
            setCurrentTrackInd(null);
            setIsPlaying(false);
        }
    }

    function handleTrackClick(evt) {
        let trackEl = evt.target.closest('.track');
        if (trackEl) {
            playTrack(trackEl.id);
        }
    }
    
    function handlePlayPauseClick() {
        if (!isPlaying) {
            let track = tracks[currentTrackInd] ? currentTrackInd : 0;
            playTrack(track);
        } else {
            setIsPlaying(false);
        }
       
    }

    function handleSkipClick(evt) {
        let skipEl = evt.target.closest('.skip');
        if (skipEl) {
            playTrack(parseInt(currentTrackInd) + 
                        parseInt(skipEl.value));
        }
    }

    return (
        (!isEmpty(playlistInfo)) && <div className='playlist-container'>
            <Player playlistInfo={playlistInfo} 
                    playingInfo={tracks[currentTrackInd]}
                    isPlaying={isPlaying}
                    handlePlayPauseClick={handlePlayPauseClick}
                    handleSkipClick={handleSkipClick}/>
            <ul className="track-list" onClick={handleTrackClick}>
                {tracks.map((track, i) => 
                    <Track key={track.uri}
                        track={track}
                        trackInd={i}
                        playing={i === currentTrackInd}/>
                )}
            </ul>
        </div>
    );
}

export default Playlist;