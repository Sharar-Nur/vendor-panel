import React, { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { ImArrowRight2 } from "react-icons/im";
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from "jquery";



export default function Otp({ title, subtitle, number }) {

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [data, setData] = useState();
    const [error, setError] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [otpMobileNumber, setOtpMobileNumber] = useState("");
    const { state } = useLocation();
    let location = useLocation();
    let navigate = useNavigate();


    useEffect(() => {
        if (state === null || state.mobileNumber === undefined || state.mobileNumber === "" || state.mobileNUmber === null) {
            navigate("/signup");
            return;
        }

        setOtpMobileNumber(state.mobileNumber)

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
    }, [data, error, isLoaded, navigate, otp, state])

    
    // Destroy OTP session and redirect to forget password step one page after 5 minutes
    setTimeout(() => {
        window.history.replaceState({}, "");
        navigate("/signup");
        return;
    }, 500000);

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
        <div className="w-3/5">
            <ToastContainer />
            <h1 className="font-bold text-4xl mb-7">{title}</h1>
            <div className="bg-neutral-100 px-8 py-10 text-secondary rounded-lg">
                <p className="mb-6">{subtitle} <span className="font-bold">{otpMobileNumber}</span></p>
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
                        ? <p> Didn’t get the code yet? <button type="button" onClick={otpResend} className="font-bold text-primary">Send Again <ImArrowRight2 className='inline ml-1' /></button></p>
                        : <>
                            <p className="text-primary font-bold cursor-pointer mb-2.5">Didn’t get the code yet?</p>
                            <p>Don’t have any account? <Link to="#" className="font-bold text-primary ">Signup Instead <ImArrowRight2 className='inline ml-1' /></Link></p>
                        </>
                    }
                </form>
            </div>
        </div>
    )
}
