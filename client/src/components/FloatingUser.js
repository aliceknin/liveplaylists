import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash.isempty';
import UserProvider from '../contexts/UserProvider';

function FloatingUser(props) {
    const user = useContext(UserProvider.context);
    if (!isEmpty(user)) {
        return (
            <div>
                <Link to="user">{user.name}</Link>
            </div>
        );
    } else {
        return (
            <div>
                <a href="/auth/spotify">Login with Spotify</a>
            </div>
        );
    }
}

export default FloatingUser;