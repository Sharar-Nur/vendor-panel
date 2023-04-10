import React from 'react';
import { AiOutlineRight } from "react-icons/ai";
import business from '../../../assets/images/business.svg'
import transaction from '../../../assets/images/transaction.svg'
import bank from '../../../assets/images/bank.svg'
import upload from '../../../assets/images/upload.svg';
import { ImArrowRight2 } from "react-icons/im";

const BusinessProfile = () => {
    return (
        <div className='w-3/5'>
            <h1 className="font-bold text-4xl mb-8">Complete Business Profile</h1>
            <div className='bg-neutral-100 px-8 py-4 text-secondary rounded-lg'>
                <p className="mb-5">We need to know few details about your business. Please provide these details and documents as per your <strong>Trade License</strong> to avail all the features of Deshi</p>
                <div className='flex justify-between'>
                    <h3 className="text-2xl font-semibold mb-2.5">Complete Your Profile</h3>
                    <h4 className="text-xl">1/4</h4>
                </div>

                <div className="bg-[#DDDDDD] rounded-2xl mb-6">
                    <div className="px-4 bg-primary rounded-2xl w-3/12 py-1"></div>
                </div>

                <div className="group bg-white p-5 rounded-lg mb-5 flex items-center cursor-pointer hover:bg-primary ">
                    <div className="bg-[#E8F4EB] rounded-full w-28 h-[70px] flex items-center justify-center mr-5">
                        <img src={business} alt="" />
                    </div>
                    <div className="">
                        <h5 className="font-bold text-xl mb-3 group-hover:text-white">Provide Business Details</h5>
                        <p className="text-secondary group-hover:text-white">We need to know more about your business. Please complete you profile. </p>
                    </div>
                    <AiOutlineRight className='items-center h-auto text-xl group-hover:fill-white' />
                </div>

                <div className="group bg-white p-5 rounded-lg mb-5 flex items-center cursor-pointer hover:bg-primary ">
                    <div className="bg-[#E8F4EB] rounded-full w-28 h-[70px] flex items-center justify-center mr-5">
                        <img src={transaction} alt="" />
                    </div>
                    <div className="">
                        <h5 className="font-bold text-xl mb-3 group-hover:text-white">Set a Transaction Profile</h5>
                        <p className="text-secondary group-hover:text-white">We need to know more about your business. Please complete you profile. </p>
                    </div>
                    <AiOutlineRight className='items-center h-auto text-xl group-hover:fill-white' />
                </div>

                <div className="group bg-white p-5 rounded-lg mb-5 flex items-center cursor-pointer hover:bg-primary ">
                    <div className="bg-[#E8F4EB] rounded-full w-28 h-[70px] flex items-center justify-center mr-5">
                        <img src={bank} alt="" />
                    </div>
                    <div className="">
                        <h5 className="font-bold text-xl mb-3 group-hover:text-white">Add a Bank Account</h5>
                        <p className="text-secondary group-hover:text-white">We need to know more about your business. Please complete you profile. </p>
                    </div>
                    <AiOutlineRight className='items-center h-auto text-xl group-hover:fill-white' />
                </div>

                <div className="group bg-white p-5 rounded-lg mb-5 flex items-center cursor-pointer hover:bg-primary ">
                    <div className="bg-[#E8F4EB] rounded-full w-28 h-[70px] flex items-center justify-center mr-5">
                        <img src={upload} alt="" />
                    </div>
                    <div className="">
                        <h5 className="font-bold text-xl mb-3 group-hover:text-white">Upload Documents</h5>
                        <p className="text-secondary group-hover:text-white">We need to know more about your business. Please complete you profile. </p>
                    </div>
                    <AiOutlineRight className='items-center h-auto text-xl group-hover:fill-white' />
                </div>

                <p className="text-primary font-bold text-center cursor-pointer">I will do it later <ImArrowRight2 className='inline' /></p>
            </div>
        </div>
    );
};

export default BusinessProfile;