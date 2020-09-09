import React, { createContext, useState, useEffect } from 'react';
import isEmpty from 'lodash.isempty';

const UserContext = createContext(null); // set the default user to null
UserContext.displayName = "UserContext";

const UserProvider = ({children}) => {
    const [user, setUser] = useState({}); 

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
        console.log("fetching the user in the user provider");
        fetch('/auth/user')
        .then(res => res.json())
        .then(res => {
            console.log("response from trying to fetch the user: ", res);
            if (!isEmpty(res)) {
                setUser({
                    ...res,
                    logout
                });
                console.log("set user!");
            } else {
                console.log("no user to set");
            }
        })
        .catch(err => {
            console.log(err);
        });
    }, []);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.context = UserContext;
export default UserProvider;