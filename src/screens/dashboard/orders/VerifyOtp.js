import React, { useEffect, useState } from 'react';
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg';
import Button from '../../../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { ImArrowRight2 } from "react-icons/im";
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import OtpSpace from "../../../assets/icons/otp-space.png";

import BlackButton from '../../../components/BlackButton';
import Popup from '../../../components/Popup';
import $ from "jquery";



export default function VerifyOtp({ title, subtitle, number }) {

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [data, setData] = useState();
    const [error, setError] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [otpMobileNumber, setOtpMobileNumber] = useState("");
    const { state } = useLocation();
    let location = useLocation();
    let navigate = useNavigate();
    const [editInstruction, setEditInstruction] = useState({
        VerifyOtp2: false
    });

    const openInstructionModel = (id) => {
        switch (id) {
            case 1:
                setEditInstruction({ VerifyOtp2: true });
                break;
            default:
                break;
        }
    }
    const closeInstructionModel = () => {
        setEditInstruction({ VerifyOtp2: false });
    }






    function handleChange(element, index) {
        if (isNaN(element.value)) {
            return false;
        }

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])
        if (element.value !== "" && element.nextSibling) {
            element.nextSibling.focus();
        }

        if (element.value === "" && element.previousSibling) {
            element.previousSibling.focus();
        }
    }



    const onSubmit = (e) => {
        e.preventDefault();
        let otpString = otp.join('');
        if (otpString.length === 6) {
            fetchData(otpString);
            return;
        }

        toast.error("Please enter valid OTP")
    }



    async function fetchData(param) {
        await fetch(process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_PREFIX + "signup/verify-otp", {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }),

            body: JSON.stringify({
                mobile_number: otpMobileNumber,
                otp: param
            })

        }).then(res => res.json()).then(
            (result) => {
                setIsLoaded(true);
                setData(result);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        );
    }

    async function otpResend() {
        await fetch(process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_PREFIX + "signup/existence", {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),

            body: JSON.stringify({
                mobile_number: otpMobileNumber
            })
        }).then(res => res.json()).then(
            (result) => {
                var finalRes = JSON.stringify(result);
                finalRes = JSON.parse(finalRes);
                console.log(result);
                if (finalRes["code"] === 200) {
                    toast.success("OTP bas been send again on your mobile number.");
                    return;
                }
            },
            (error) => {
                toast.error(error.message.toString());
            }
        );
    }


    return (

        <div>



            <div className='float-right p-4'>

                <input type="button" value="Verify OTP" onClick={() => openInstructionModel(1)} className="bg-[#00D632] text-white py-2 px-5 rounded-sm hover:cursor-pointer hover:bg-green-500"></input>
            </div>


            {(editInstruction.VerifyOtp2) &&
                <>
                    <Popup content={

                        <div className="w-[470px] p-6 font-medium ">
                            <div className="flex justify-between">
                                <h1 className='font-semibold leading-5 text-xl text-[#222222]'>Verify OTP</h1>
                                <CloseBtn className="cursor-pointer" onClick={() => closeInstructionModel(1)} />
                            </div>
                            <p className='text-sm font-normal leading-5 mt-5'>Please enter the 6-digit code we’ve sent to +880 1712345678 and consumer’s order invoice</p>
                            <p className="mb-6">{subtitle} <span className="font-bold">{otpMobileNumber}</span></p>
                            <form onSubmit={onSubmit}>

                                <div className="flex items-center space-x-2 w-full container mb-4">
                                    {otp.map((data, index) => {
                                        return (
                                            <span className='flex justify-center items-center' key={index}>
                                                <input
                                                    type="text"
                                                    name="otp[]"
                                                    maxLength="1"
                                                    key={index}
                                                    value={data}
                                                    className="w-[60px] h-[60px] border border-solid border-[#EEEEEE] rounded-lg text-center"
                                                    onChange={(e) => {
                                                        handleChange(e.target, index);
                                                    }}
                                                    onFocus={(e) => e.target.select()}

                                                />
                                                {((index + 1) % 2 === 0 && index < (otp.length - 1)) && (<img alt="OTP Space" src={OtpSpace} className="h-[2px] w-[9px] ml-[8px] mr-0"></img>)}
                                            </span>

                                        );
                                    })}
                                </div>
                                <BlackButton name="Verify OTP" />

                            </form>
                        </div>

                    }
                    />
                </>
            }
        </div>
    )
}