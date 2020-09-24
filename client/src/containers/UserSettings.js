import React, { useContext } from 'react';
import {Link} from 'react-router-dom';
import isEmpty from 'lodash.isempty';
import UserContext from '../contexts/UserContext';
import SpotifyEmbed from '../components/SpotifyEmbed';

const UserSettings = () => {
    const { user } = useContext(UserContext);

    return (
        <div className="user-settings">
            <div className="inner">
                <h1>User Settings</h1>
                <p>I don't know how you got here, but you're on the user page. Stay awhile. </p>
                <p><small>There's nothing much to do, though. It's a bit of a work in progress.</small></p>
                <Link to='/'>take me back, please</Link>
                {(!isEmpty(user)) ?
                <div>
                    <p>Here's some info about the user, in case you're looking for that:</p>
                    <ul>
                        <li>Name: {user.name}</li>
                        <li>Spotify ID: {user.spotifyID}</li>
                    </ul>
                    {user.playlistID &&
                    <SpotifyEmbed playlistID={user.playlistID}/>}
                    <button onClick={user.logout}>
                        Log Out
                    </button>
                </div>
                :
                <p>There's no user yet.</p>}
            </div>
        </div>
    );
}

export default UserSettings;