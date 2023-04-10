import React from 'react';
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Route, Routes } from "react-router-dom";
import Home from '../screens/dashboard/home/home'

const Test = () => {
    return (
        <div className="body w-full bg-white font-medium">
            {/* TOP HEADER */}
            <div className="w-full border-b-2 flex justify-between">
                <Navbar />
            </div>

            {/* MAIN BODY */}
            <div className="flex w-full h-full fixed bg-white">
                {/* LEFT SIDE BAR */}
                <Sidebar />
                <Home />
            </div>
        </div>
    );
};

export default Test;