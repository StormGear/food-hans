

import React, { useEffect,useState } from 'react'
import { NavLink, useParams } from "react-router";
import { useContext } from "react";
import { CartContext } from "../contextproviders/Cartcontext";
import { AuthContext } from "../contextproviders/Authcontext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import baseUrl from '../constants';
import { IoLogOut } from "react-icons/io5";
import logo from '../assets/images/logo.png'; 
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';


const Navbar = () => {
    const { userId } = useParams();
    const { cartItems, setCartItems } = useContext(CartContext);
    const { logout, authState, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };

    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`${baseUrl}/api/users/${userId}`)
          const cart_res = await axios.get(`${baseUrl}/api/cartitems/${response.data.user_id}`)
          dispatch({ type: 'SET_USER', payload: response.data })
          setCartItems([ ...cart_res.data])
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
      fetchUserDetails().then(() => console.log('cart items', cartItems));

      return () => {
        console.log('user fetch cleanup')
      }  
    }, [])


    
  return (
    <nav className='w-full'>
      <div className='w-full relative  min-h-16 flex justify-between bg-secondary-color'>
          <div>
            <NavLink to={`/users/${userId}/`} className='text-white text-2xl font-semibold absolute left-4 p-4'>
             HansFood
            </NavLink>
          </div>
        <div className="block lg:hidden p-4">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
        <div className="flex justify-end items-center absolute right-4">
           <button className='mr-4 hidden md:block' onClick={() => {
            logout()
            navigate('/')
           }
            }>
           Logout
           </button>
          <p className="text-white mr-4 hidden md:block font-bold">Welcome, {authState.user?.name}</p>
           
            <span>
              <NavLink
                  to={`/users/${userId}/cart`}
                  className={
                    ({ isActive}) => {
                      if (isActive) {
                        setIsOpen(false)
                        return "bg-primary-color text-white px-4 py-2 rounded my-4 mx-4 hidden md:block"
                      }
                      return "bg-primary-color text-white px-4 py-2 rounded my-4 mx-4 hidden md:block"
                    }
                   }
                >
                  Cart - {cartItems.length}
                </NavLink>
            </span>
          </div>
        </div>
      


       {/* Mobile Menu */}
       <div className={`transition-width-height ease-in-out delay-150 duration-100 ${isOpen ? 'w-full h-full' : 'w-0 h-0'} lg:hidden  bg-blue-300`}>
        <ul className={`text-white`}>
          <li className="py-3">
            <NavLink to={`/users/${userId}/cart`} className="block px-4 py-2">Cart - {cartItems.length}</NavLink>
          </li>
          <li className="py-3">
            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="block px-4 py-2"
            >
              Logout
            </button>
          </li>
        </ul>
       </div>
    </nav>
  )
}

export default Navbar
