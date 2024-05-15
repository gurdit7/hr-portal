"use client"
import React, { useContext,useState } from 'react';

const AuthContext = React.createContext();


export default function useAuth (){
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {    
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [userData, setUserData] = useState('');
    const value = {
        setUserLoggedIn,
        userLoggedIn,
        userData,
        setUserData
      };
    return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
      );
}