import React from 'react';
import { Link } from 'react-router-dom';

const UserMenuOptions = (props) => {
    return (
        <ul className={props.show ? "results-list show" : "results-list"}>
            <li tabIndex="0"><Link to="user">Settings</Link></li>
            <li onClick={props.logout} tabIndex="0">Log Out</li>
            <li onClick={props.logout}
                className="not-you"
                tabIndex="0">
                    <a href='/auth/switch_user'>Not you?</a>
            </li>
        </ul>
    )
}

export default UserMenuOptions;