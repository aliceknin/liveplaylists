import React, { useContext } from 'react';
import UserContext from '../contexts/UserContext';
import isEmpty from 'lodash.isempty';

const HeroContent = () => {
    const { user } = useContext(UserContext);
    return (
        <>
        <h1>Live Playlists</h1>
        <h2>Create Spotify playlists featuring artists with upcoming events in your&nbsp;city!</h2>
        {(isEmpty(user)) &&
        <a href='/auth/spotify'><button className="button-callout">Login with Spotify</button></a>}
        </>
    );
}

export default HeroContent;