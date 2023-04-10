import React from 'react';

const Popup = (props) => {

    return (
        <>
            {(props.is_big === 1) ?
                <div className="fixed bg-[#00000050] z-10 w-full h-screen top-0 left-0">
                    <div className="relative w-[65%] min-w-fit m-auto max-h-[70vh] bg-white rounded border-solid border-ash  mt-40 ">
                        {/* <span className="close-icon" onClick={props.handleClose}>x</span> */}
                        {props.content}
                    </div>
                </div>
                :
                <div className="fixed bg-[#00000050] z-10 w-full h-screen top-0 left-0">
                    <div className="relative w-[25%] min-w-fit m-auto max-h-[70vh] bg-white rounded border-solid border-ash overflow-auto mt-40 custom-scroll-auto">
                        {/* <span className="close-icon" onClick={props.handleClose}>x</span> */}
                        {props.content}
                    </div>
                </div>
            }

        </>
    );
};

export default Popup;