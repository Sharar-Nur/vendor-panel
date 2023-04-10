import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg'
import BlackButton from '../../../components/BlackButton';
import proPic from '../../../assets/images/pro_pic.jpg'
import shareTrip from '../../../assets/images/shareTrip.jpg'
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';
import PostLoginPostApi from '../../../components/api/PostLoginPostApi';
import { data } from 'jquery';

const AddNewConnect = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [apiData, setApiData] = useState([]);
    const [apiCall, setApiCall] = useState(false);
    const [isExists, setIsExists] = useState(false);
    let { state } = useLocation();

    const navigate = useNavigate();
    

    const handleClick = async (e) => {

        e.preventDefault();


        //  Check Deshi User Exists
        await PostLoginPostApi("deshi-user-exists", JSON.stringify({ mobile_no: phoneNumber })).then((responseJson) => {

            let response = JSON.stringify(responseJson);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);


                if (responseData["code"] === 200) {

                    setApiData(responseData['data']);
                    setApiCall(true);

                    if (responseData['data']?.availability === true) {
                        setIsExists(true);
                        navigate("/dashboard/connects/view-connect", {
                            state: {
                                userData: responseData['data']
                            }
                        });
                    }
                }

                return;
            }

            toast.error("A problem occur. Please try again.");
            return;

        }).catch((error) => {
            toast.error("A problem occur. Please try again.");
            console.log(error);
        });
    }


    const phoneNumberChangeHandler = (val) => {
        setIsExists(false);
        setApiCall(false);
        setPhoneNumber(val);
    }




    return (
        <div className="h-full">
            <header className="p-4 border-b-2 border-dark-white mb-[60px]">
                <Link to="/dashboard/connects" state={{ from: state }}><CloseBtn className="float-left" /></Link>
                {<p className="text-center text-xl font-medium	">Add New Connect</p>}
            </header>
            <main className="max-w-2xl m-auto">
                {/* Add Connect */}



                {(isExists === false && apiCall === true) ?
                    <div className="p-5 bg-[#FDEFF4] rounded mb-[30px]">
                        <p>Sorry! You can’t add {phoneNumber} as a connect as there’s No Deshi User associated with it. Try a New number instead? </p>
                    </div>
                    :
                    <div className="p-5 bg-neutral-100 rounded mb-[30px]">
                        <p>Enter the phone number you want to Connect. We’ll check if there’s any Deshi Account associated with it. </p>
                    </div>
                }


                <h1 className="text-xl">Phone Number</h1>

                <div className="my-[15px]">
                    <input type="tel" name="number" value={phoneNumber} onChange={(e) => phoneNumberChangeHandler(e.target.value)} placeholder="Enter Phone Number" className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" />
                </div>
                <BlackButton name="Let’s Check" onClick={handleClick} />


                {/* Save as Connect */}

                {/* <div className="flex items-center justify-between border border-solid border-neutral-100 p-5 rounded" style={{ boxShadow: "0px 4px 40px rgba(0,0,0,0.05)" }}>
                    <div className="flex items-center ">
                        <img src={proPic} alt="pro pic" className="rounded-full " />
                        <img src={shareTrip} alt="pro pic" className="rounded-md" />
                        <div className="ml-5">
                            <h4 className="text-xl mb-2.5">Toyabur Rahman Tuhin</h4>
                            <p>01712345678</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-ash mb-2.5">Account Type</p>
                        <p className="text-end">Consumer</p>
                    </div>
                </div>

                <div className="my-5 flow-root px-2">
                    <p className="text-ash mb-5">Recipient Info</p>
                    <div className="float-left text-secondary">
                        <p className="mb-2.5">Name</p>
                        <p className="mb-2.5">Mobile Number</p>
                        <p className="mb-2.5">Email</p>
                        <p>Shipping</p>
                    </div>
                    <div className="float-right text-end">
                        <p className="mb-2.5">Toyabur Rahman Tuhin</p>
                        <p className="mb-2.5">01712345678</p>
                        <p className="mb-2.5">Hidden</p>
                        <p>Hidden</p>
                    </div>
                </div>
                <BlackButton name="Save as Connect" /> */}
            </main>
        </div >
    );
};

export default AddNewConnect;