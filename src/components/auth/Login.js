// @ts-nocheck
import React, { useState, useContext, useReducer } from 'react';
import { Mail, Lock,  Eye, EyeOff,  } from 'lucide-react';
import { AuthContext } from '../../contextproviders/Authcontext';
import baseUrl from '../../constants';
import axios from 'axios';
// import { Spinner } from "flowbite-react";
import { loadingReducer, initialState } from '../reducers/reducers'
import { NavLink } from 'react-router-dom';
import  Spinner  from '../Spinner';
import { useNavigate } from 'react-router-dom';



const Login = () => {
    const {  login } = useContext(AuthContext)
    const [passwordCheck, setPasswordCheck] = useState('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
    const [emailCheck, setEmailCheck] = useState('Enter a valid email address');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      name: '',
      allergies: ''
    });
  
  
   const [loadingState, dispatch] = useReducer(loadingReducer, initialState);
  
    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
      const validatePassword = (password) => {
        const minLength = 8;
        // const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
        return password.length >= minLength  && hasLowerCase && hasNumber;
      };
  
      const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
      }
  
      if (e.target.name === 'password') {
        const isValid = validatePassword(e.target.value);
        if (isValid) {
          setPasswordCheck('');
        } 
      }
  
      if (e.target.name === "email") {
        const isValid = validateEmail(e.target.value);
        if (isValid) {
          setEmailCheck('')
        } 
      }
      
    };
  
    const handleSubmit =  async (e) => {
      e.preventDefault();
      // @ts-ignore
      dispatch({ type: 'LOADING' });
      let response;
      
      try {
        response = await axios.post(`${baseUrl}/api/users/login`, {
          email: formData.email,
          password: formData.password
        });
        // Perform login
        console.log('response', response.data)
        const res = login(response.data);
        if (res === 'error') {
          dispatch({ type: 'ERROR', payload: 'Login was not successful' })
        } else {
          dispatch({ type: 'SUCCESS' });
          navigate(`/users/${response.data.user.user_id}`)
        }

      
    } catch (error) {
      if (error.response) {
        // @ts-ignore
        dispatch({ type: 'ERROR', payload: error.response.data.message ?? error.message})
      } else {
     // @ts-ignore
     dispatch({ type: 'ERROR', payload:  error.message})
      }
    }
      console.log('Form submitted:', formData);
    };
  
    return (
      <div className="bg-custom-image bg-cover bg-center bg-no-repeat min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full md:w-1/2 max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-white border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Login
            </h2>
  
            <p className="mt-1 text-sm text-gray-600">
              Create an account to get started
            </p>
          </div>
  
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-len-500 focus:border-blue-500 outline-none transition-colors"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <p>{ emailCheck }</p>
              </div>
  
  
              {/* Password Field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                  >
                    {showPassword ? <Eye className="h-4 w-4"/> : <EyeOff className="h-4 w-4"/>}
                  </button>
                  <input
                    id="password"
                    name="password"
                    type= { showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className= { passwordCheck.length < 1 ? "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors" : "w-full pl-10 pr-4 py-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors" }
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <p>{ passwordCheck }</p>
              </div>
            </div>
  
            {/* Submit Button */}
            <button
              disabled={(passwordCheck.length > 0 && emailCheck.length > 0) || loadingState.loading}
              type="submit"
              className={`mt-6 w-full  py-2 px-4 rounded-lg focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors
                ${(passwordCheck.length > 0 || emailCheck.length > 0) || loadingState.loading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-400 text-white hover:bg-green-400'}
                `}
            >
             { loadingState.loading ? <Spinner /> : 'Login'}
            </button>
  
            {/* Toggle Link */}
            <p className="mt-4 text-sm text-gray-600 text-center">
              
               Don't have an account? 
              <NavLink to="/signup" className="text-blue-600 hover:underline focus:outline-none"> Sign Up</NavLink>
            </p>
            <p className='mt-4 mx-auto flex items-center justify-center w-full text-red-500'> { loadingState.error}</p>
          </form>
        </div>
      </div>
    );
  };
  
  export default Login;