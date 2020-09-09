import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import isEmpty from 'lodash.isempty';
import UserProvider from '../contexts/UserProvider';

class UserSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
        this.userInfo = this.userInfo.bind(this);
    }

    userInfo(user) {
        console.log('user settings user: ', user);
        if (!isEmpty(user)) {
            return (
                <div>
                    <p>Here's some info about the user, in case you're looking for that:</p>
                    <ul>
                        <li>Name: {user.name}</li>
                        <li>Spotify ID: {user.spotifyID}</li>
                    </ul>
                    <button onClick={user.logout}>
                        Log Out
                    </button>
                </div>
            )
        } else {
            return (
                <p>There's no user yet.</p>
            )
        }
    }

    render() {
        let user = this.context;
        return (
            <div className="user-settings">
                <div className="inner">
                    <h1>User Settings</h1>
                    <p>I don't know how you got here, but you're on the user page. Stay awhile. </p>
                    <p><small>There's nothing much to do, though. It's a bit of a work in progress.</small></p>
                    <Link to='/'>take me back, please</Link>
                    {this.userInfo(user)}
                </div>
            </div>
        )
    }
}

UserSettings.contextType = UserProvider.context;
export default UserSettings;