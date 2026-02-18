import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [hideValues, setHideValues] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
        <UserContext.Provider value={{ hideValues, setHideValues, notifications, setNotifications }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
