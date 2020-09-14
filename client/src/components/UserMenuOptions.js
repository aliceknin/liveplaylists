import React from 'react';
import { Link } from 'react-router-dom';

const UserMenuOptions = (props) => {
    return (
        <ul className={props.show ? "results-list show" : "results-list"}>
            <li><Link to="user">Settings</Link></li>
            <li onClick={props.logout}>Log Out</li>
        </ul>
    )
}

export default UserMenuOptions;