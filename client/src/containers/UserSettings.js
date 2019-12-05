import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class UserSettings extends Component {
// constructor(props) {
//     super(props);
//     this.state = {}
// }

    render() {
        return (
            <div className="user-settings">
                <div className="inner">
                    <h1>User Settings</h1>
                    <p>I don't know how you got here, but you're on the user page. Stay awhile. </p>
                    <p><small>There's nothing much to do, though. It's a bit of a work in progress.</small></p>
                    <Link to='/'>take me back, please</Link>
                </div>
            </div>
        )
    }
}

export default UserSettings;