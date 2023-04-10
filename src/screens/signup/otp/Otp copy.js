import React, { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { ImArrowRight2 } from "react-icons/im";
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Otp = ({ title, subtitle, number }) => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [data, setData] = useState();
    const [error, setError] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const { state } = useLocation();
    let location = useLocation();
    let navigate = useNavigate();


    useEffect(() => {

        if (state === null || state.mobileNumber === undefined || state.mobileNumber === "" || state.mobileNUmber === null) {
            console.log("State is Null");
            navigate("/signup");
            return;
        }

        if (isLoaded === true) {
            if (error) {
                toast.error(error.message.toString());
                return;
            }

            let response = JSON.stringify(data);
            response = JSON.parse(response);
            if (response["code"] === 200) {
                window.history.replaceState({}, "");
                navigate("/add-email", {
                    state: {
                        mobile_number: state.mobileNumber,
                        otp: otp
                    }
                });
                return;
            }
            toast.error(response["messages"].toString());
        }
    }, [data, error, isLoaded, navigate, state])

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


    async function fetchData(param) {

    }


    setTimeout(() => {
        window.history.replaceState({}, "");
        navigate("/signup");
        return;
    }, 500000);




    // const otpMobileNumber = window.localStorage.getItem("otp-mobile-number");


    // // Check OTP page access is valid or not
    // if( otpMobileNumber === undefined || otpMobileNumber === "" || otpMobileNumber === null ) {
    //     navigate("/forget-password-step-one");
    //     return;
    // }

    // Destroy OTP session and redirect to forget password step one page after 5 minutes
    // setTimeout(() => {
    //     window.localStorage.removeItem("otp-mobile-number");
    //     navigate("/forget-password-step-one");
    //     return;
    // }, 500000);




    const onSubmit = (e) => {
        e.preventDefault();
        let otpString = otp.join('');
        if (otpString.length === 6) {
            fetchData(otpString);
            return;
        }

        toast.error("Please enter valid OTP")
    }

    return (
        <div className="w-3/5">
            <ToastContainer />
            <h1 className="font-bold text-4xl mb-7">{title}</h1>
            <div className="bg-neutral-100 px-8 py-10 text-secondary rounded-lg">
                <p className="mb-6">{subtitle} <span className="font-bold">{state?.mobileNumber}</span></p>
                <form onSubmit={onSubmit}>
                    <div className="flex items-center space-x-2 container mb-4">
                        {otp.map((data, index) => {
                            return (
                                <input
                                    type="text"
                                    name="otp[]"
                                    maxLength="1"
                                    key={index}
                                    value={data}
                                    className="w-[45.17px] h-[60px] border border-solid border-[#EEEEEE] rounded-lg text-center"
                                    onChange={(e) => {
                                        handleChange(e.target, index);
                                    }}
                                    onFocus={(e) => e.target.select()}
                                />
                            );
                        })}
                    </div>
                    <Button name="Verify OTP" />
                    {location.pathname === "/otp"
                        ? <p> Didn’t get the code yet? <Link to="#" className="font-bold text-primary ">Send Again <ImArrowRight2 className='inline ml-1' /></Link></p>
                        : <>
                            <p className="text-primary font-bold cursor-pointer mb-2.5">Didn’t get the code yet?</p>
                            <p>Don’t have any account? <Link to="#" className="font-bold text-primary ">Signup Instead <ImArrowRight2 className='inline ml-1' /></Link></p>
                        </>
                    }
                </form>
            </div>
        </div>
    );
};

export default Otp;