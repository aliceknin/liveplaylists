import React, { useContext } from 'react';
import UserProvider from '../contexts/UserProvider';
import isEmpty from 'lodash.isempty';

const HeroContent = () => {
    const user = useContext(UserProvider.context);
    return (
        <>
        <h1>Live Playlists</h1>
        <h2>some kind of description that has some chance of getting a user to want to check this thing out</h2>
        {(isEmpty(user)) &&
        <a href='/auth/spotify'><button className="button-callout">Login with Spotify</button></a>}
        </>
    );
}

export default HeroContent;