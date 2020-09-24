import React, { useState, useEffect } from 'react';
import UserContext from './UserContext';
import isEmpty from 'lodash.isempty';
import axios from 'axios';

const UserProvider = ({children}) => {
    const [user, setUser] = useState({}); 
    const [shouldRefreshUser, setRefreshUser] = useState(true);

    function refreshUser() {
        setRefreshUser(true);
    }

    function logout() {
        fetch('/auth/logout', {})
        .then(response => {
            if (response.status === 200) {
                setUser(null);
            }
        });
    }

    // when this component mounts, fetch the logged in user from the server
    useEffect(() => {
        async function fetchUser() {
            if (!shouldRefreshUser) return;
            console.log("fetching the user in the user provider");
            try {
                console.log("fetching the user in the user provider");
                const res = await axios.get('auth/user');
                let fetchedUser = res.data;
                console.log("response from trying to fetch the user: ", fetchedUser);
                if (!isEmpty(fetchedUser)) {
                    setUser({
                        ...fetchedUser,
                        logout
                    });
                    console.log("set user!");
                } else {
                    console.log("no user to set");
                }
            } catch (err) {
                console.log("couldn't fetch the user", err);
            } finally {
                setRefreshUser(false);
            }
        }
        fetchUser();
    }, [shouldRefreshUser]);

    return (
        <UserContext.Provider value={{user, refreshUser}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;