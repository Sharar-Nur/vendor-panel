import React from 'react';

const Button = ({ name, bg_clr, font_color, margin }) => {
    // console.log(margin);
    return (
        <button style={{ marginInline: margin }} className={`px-5 py-2.5 rounded cursor-pointer bg-${bg_clr === undefined ? "[#DDDDDD]" : "primary"} text-${font_color === undefined ? "secondary" : "white"}`}>{name}</ button>

    );
};

export default Button;