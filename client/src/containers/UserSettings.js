import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import UserService from '../services/UserService';

class UserSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
        this.userService = new UserService();
        this.userInfo = this.userInfo.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        this.userService.getLoggedInUser()
        .then(user => this.setState({user: user}));
    }

    userInfo() {
        if (this.state.user) {
            return (
                <div>
                    <p>Here's some info about the user, in case you're looking for that:</p>
                    <ul>
                        <li>Name: {this.state.user.dbUser.name}</li>
                        <li>Spotify ID: {this.state.user.dbUser.spotifyID}</li>
                        <li>Country: {this.state.user.profile.country}</li>
                    </ul>
                    <button onClick={this.handleLogout}>
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

    handleLogout() {
        this.userService.logout()
        .then(response => {
            if (response.status === 200) {
                this.setState({user: null});
            }
        });
    }

    render() {
        return (
            <div className="user-settings">
                <div className="inner">
                    <h1>User Settings</h1>
                    <p>I don't know how you got here, but you're on the user page. Stay awhile. </p>
                    <p><small>There's nothing much to do, though. It's a bit of a work in progress.</small></p>
                    <Link to='/'>take me back, please</Link>
                    {this.userInfo()}
                </div>
            </div>
        )
    }
}

export default UserSettings;