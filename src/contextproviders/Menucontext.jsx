// @ts-nocheck
import React, { createContext, useReducer } from 'react';
import { authStateReducer, initialAuthState } from '../components/reducers/reducers';


// @ts-ignore
export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authStateReducer, initialAuthState)
   

    const login =  (user) => {
        if (user.message === "Login successful") {
          // @ts-ignore
          console.log("user", user.user)
          dispatch({ type: 'LOGIN', payload: user.user })
          console.log(authState)
          return 'success'
        } else {
          console.log("Login was not successful", user)
          dispatch({ type: 'LOGOUT' }) 
          return 'error'
        }
    };
  
    const logout = () => {
        // @ts-ignore
        dispatch({ type: 'LOGOUT' })
    };

    const signup = (user) => {
      if (user.user_id) {
        // @ts-ignore
        dispatch({ type: 'SIGNUP', payload: user })
        return 'success'
    } else {
      console.log("signup was not was not successful", user)
      dispatch({ type: 'LOGOUT' }) 
      return 'error'
    }
  }
  
    return (
      <AuthContext.Provider value={{ authState, dispatch, login, logout, signup }}>
        {children}
      </AuthContext.Provider>
    );
  };
