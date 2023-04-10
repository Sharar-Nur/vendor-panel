import React from 'react';
import { NavLink } from "react-router-dom";
// import '../styles/SignUpOrLogin.css'

const SignUpOrLogin = () => {
    return (
        <nav className="mb-10">
            {/* Add dynamic class .text-gray-500 for the inactive link  */}
            <NavLink to='/signup/step-one' className="mr-5">Sign Up</NavLink>
            <NavLink to='/login' className="ml-3.5">Log In</NavLink>
        </nav >
    );
};

export default SignUpOrLogin;