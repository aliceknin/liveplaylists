import React, { useState, useContext } from 'react';
import isEmpty from 'lodash.isempty';
import UserProvider from '../contexts/UserProvider';
import '../styles/FloatingUser.scss';
import userImage from "../images/user.svg";
import guestImage from "../images/guest.svg";
import UserMenuOptions from './UserMenuOptions';

function FloatingUser(props) {
    const user = useContext(UserProvider.context);
    const [ showMenu, setShowMenu ] = useState(false);

    return (
        (!isEmpty(user)) ?
        <div className="user-container"
             onClick={() => setShowMenu(s => !s)}>
            <img className="icon"
                src={user.thumbURL ? user.thumbURL : userImage} 
                alt="User Settings"/>
            <span alt="User Settings" className="text">
                {user.name}
                <i className="fa fa-chevron-down"></i>
            </span>
            <UserMenuOptions show={showMenu} logout={user.logout}/>
        </div>
        :
        <div className="user-container">
            <a className="icon" href="/auth/spotify">
                <img src={guestImage} alt="User Settings"/>
            </a>
            <a className="text" href="/auth/spotify">Login with Spotify</a>
        </div>
    );

}

export default FloatingUser;