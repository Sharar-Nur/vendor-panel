import React from 'react';
import { AiOutlineRight } from "react-icons/ai";

const businessTypes = () => {
    return (
        <div className="w-3/5 rounded-lg">
            <h1 className="font-bold text-4xl mb-8">Account Created</h1>
            <div className='bg-neutral-100 p-9'>
                <p className="mb-5 text-secondary">Select a Business Type</p>
                <div className="group bg-white p-5 rounded-lg mb-5 flex cursor-pointer hover:bg-primary">
                    <div className="">
                        <h5 className="font-bold text-xl mb-3 group-hover:text-white">Sole Proprietorship</h5>
                        <p className="text-secondary group-hover:text-white">Here goes some explanation about this business type. <br /> to help users understand if the category suits to their business.</p>
                    </div>
                    <AiOutlineRight className='items-center h-auto text-xl group-hover:fill-white' />
                </div>
                <div className="group bg-white p-5 rounded-lg mb-5 flex cursor-pointer hover:bg-primary">
                    <div>
                        <h5 className="font-bold text-xl mb-3 group-hover:text-white">Private Limited</h5>
                        <p className="text-secondary group-hover:text-white">Here goes some explanation about this business type. <br /> to help users understand if the category suits to their business.</p>
                    </div>
                    <AiOutlineRight className='items-center h-auto text-xl group-hover:fill-white' />
                </div>
                <div className="group bg-white p-5 rounded-lg mb-5 flex cursor-pointer hover:bg-primary">
                    <div>
                        <h5 className="font-bold text-xl mb-3 group-hover:text-white">Partnership</h5>
                        <p className="text-secondary group-hover:text-white">Here goes some explanation about this business type. <br /> to help users understand if the category suits to their business.</p>
                    </div>
                    <AiOutlineRight className='items-center h-auto text-xl group-hover:fill-white' />
                </div>
                <div className="group bg-white p-5 rounded-lg flex cursor-pointer hover:bg-primary">
                    <div>
                        <h5 className="font-bold text-xl mb-3 group-hover:text-white">Public</h5>
                        <p className="text-secondary group-hover:text-white">Here goes some explanation about this business type. <br />to help users understand if the category suits to their business.</p>
                    </div>
                    <AiOutlineRight className='items-center h-auto text-xl group-hover:fill-white' />
                </div>
            </div>
        </div>
    );
};

export default businessTypes;