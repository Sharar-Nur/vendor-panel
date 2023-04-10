import React from 'react';

const BlackButton = ({ name, onClick, icon, type = "submit" }) => {
    return (
        <button type={type} className="w-full text-white bg-[#1A202C] py-[12px] px-[32px]  rounded-[3px] cursor-pointer flex justify-center items-center mb-3 leading-6" onClick={onClick}><span className="mr-2.5">{icon}</span>{name}</button>
    );
};

export default BlackButton;