import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash.isempty';
import UserProvider from '../contexts/UserProvider';
import '../styles/FloatingUser.scss';
import userImage from "../images/user.svg";
import guestImage from "../images/guest.svg";

function FloatingUser(props) {
    const user = useContext(UserProvider.context);
    if (!isEmpty(user)) {
        return (
            <div className="user-container full">
                <Link to="user" className="icon">
                    <img src={user.thumbURL ? user.thumbURL : userImage} 
                         alt="User Settings"/>
                </Link>
                <Link to="user" alt="User Settings" className="text">{user.name}</Link>
            </div>
        );
    } else {
        return (
            <div className="user-container empty">
                <a className="icon" href="/auth/spotify">
                    <img src={guestImage} alt="User Settings"/>
                </a>
                <a className="text" href="/auth/spotify">Login with Spotify</a>
            </div>
        );
    }
}

export default FloatingUser;