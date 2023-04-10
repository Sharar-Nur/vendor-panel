import React from 'react';
import { Link, useNavigate } from "react-router-dom";

const ButtonGroup = ({ btnOneName = "Continue", btnTwoName, handleSubmit }) => {
    return (
        <div className="mt-5">
            <button type="submit" name="agree" onClick={handleSubmit} className="w-full text-white bg-primary p-3 mb-3 rounded cursor-pointer">{btnOneName}</button>
            <button type="submit" name="disagree" onClick={handleSubmit} className="w-full text-primary bg-white p-3 mb-4 rounded cursor-pointer">{btnTwoName}</button>
        </div>
    );
};

export default ButtonGroup;