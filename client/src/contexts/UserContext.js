import { createContext } from 'react';

const UserContext = createContext({
    user: null, 
    refreshUser: () => {}
});

UserContext.displayName = "UserContext";

export default UserContext;
