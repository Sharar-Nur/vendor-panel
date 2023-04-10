import React from 'react';

const Button = ({ name = "Continue", type="submit",  onClick }) => {
    return (
        <button type={type} className="w-full text-white bg-primary p-3 mb-4 rounded cursor-pointer hover:bg-brand-dark" onClick={onClick}>{name}</button>
    );
};

export default Button;