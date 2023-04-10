import React from 'react';

const ErrorShow = () => {
    return (
        <div className="text-[15px]">
            <h6 className="font-bold">404. <span className="text-[#777777] font-normal">That’s an error.</span></h6>
            <p>The requested URL was not found on this server. </p>
        </div>
    );
};

export default ErrorShow;