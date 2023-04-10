
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from "../../../components/Button";

import { ImArrowRight2 } from "react-icons/im";


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $, { event } from 'jquery';
import OtpSpace from "../../../assets/icons/otp-space.png";
import { counter } from '@fortawesome/fontawesome-svg-core';


export default function StepTwo() {

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [apiData, setApiData] = useState([]);
    const [otpMobileNumber, setOtpMobileNumber] = useState("");

    let navigate = useNavigate();
    const { state } = useLocation();

    const [second, setSecond] = useState("seconds");
    const [timer, setTimer] = useState(90);


    useEffect(() => {
        // Check OTP page access is valid or not
        if (state === null || state.mobileNumber === null || state.mobileNumber === undefined || state.mobileNumber === "") {
            window.history.replaceState({}, "")
            navigate("/signup/step-one");
            return;
        }
        setOtpMobileNumber(state.mobileNumber);

        if (isLoaded === true) {
            if (error) {
                toast.error(error.messages.toString());
                return;
            }

            let response = JSON.stringify(apiData);
            response = JSON.parse(response);
            if (response["code"] === 200) {
                window.history.replaceState({}, "");
                let cloneOtp = [...otp];

                navigate("/signup/step-three", {
                    state: {
                        mobileNumber: otpMobileNumber,
                        otpNumber: cloneOtp.join('')
                    }
                });
                return;
            }

            toast.error(response["messages"].toString());
        }
    }, [apiData, isLoaded]);


    // Timer
    useEffect(() => {
        if (timer <= 0) {
            $("#resetOtpBtn").hide();
            $("#resetOtpBtnActive").show();
        };

        const timerInterval = setInterval(() => {
            setTimer(timer - 1);
            if ((timer - 1) === 1) {
                setSecond("second");
            }
            else {
                setSecond("seconds");
            }
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [timer]);


    var handleChange = (element, index) => {
        if (isNaN(element.value)) {
            return false;
        }

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        if (element.value !== "" && element.parentNode.nextSibling) {
            element.parentNode.nextSibling.querySelector("input").focus();
        }

        if (element.value === "" && element.parentNode.previousSibling) {
            element.parentNode.previousSibling.querySelector("input").focus();
        }
    }

    // Verify OTP
    async function fetchData(param, isResend = false) {
        await fetch(process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_PREFIX + "signup/verify-otp", {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),

            body: JSON.stringify({
                mobile_number: otpMobileNumber,
                otp: param
            })

        }).then(res => res.json()).then(
            (result) => {
                setIsLoaded(true);
                setApiData(result);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        );
    }

    var handleSubmit = (event) => {
        event.preventDefault();
        var otpString = otp.join('');
        if (otpString.length === 6) {
            fetchData(otpString);
            return;
        }

        toast.error("Please enter valid OTP");
    }

    var resendOtp = () => {
        try {
            fetch(process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_PREFIX + "signup/existence", {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify({
                    mobile_number: otpMobileNumber,
                })
            }).then(res => res.json()).then(
                (resultJSON) => {
                    var result = JSON.stringify(resultJSON);
                    result = JSON.parse(result);

                    if (result["code"] === 200) {
                        $("input").val("");

                        $("#resetOtpBtnActive").attr("disabled", "disabled");
                        $("#resetOtpBtnActive").addClass("text-ash");
                        // toast.success(result["messages"].toString());
                        toast.success("OTP has been sent");

                        setTimeout(() => {
                            document.location.reload();
                        }, 3000);

                        return;
                    }

                    toast.error(result["messages"].toString());
                },
                (error) => {
                    toast.error("A problem occur. Please try again.");
                }
            );
        } catch (ex) {
            toast.error("A problem occur. Please try again.");
        }
    }

    const goBack = () => {
        window.history.replaceState("", {});
        navigate("/signup/step-one");
    }

    return (
        <div className="w-3/5">
            <ToastContainer />
            <h1 className="font-bold text-4xl mb-7">Join Deshi</h1>
            <div className="bg-neutral-100 px-8 py-10 text-secondary rounded-lg">
                <p className="mb-6">Please enter the 6-digit code we've sent to: <span className="font-bold">{otpMobileNumber}</span></p>
                <form onSubmit={handleSubmit} >
                    <div className="flex items-center space-x-2 container mb-4">
                        {otp.map((data, index) => {
                            return (
                                <span className='flex justify-center items-center' key={index}>
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
                                        required
                                    />
                                    {((index + 1) % 2 === 0 && index < (otp.length - 1)) && (<img alt="OTP Space" src={OtpSpace} className="h-[2px] w-[9px] ml-[10px] mr-0"></img>)}
                                </span>
                            );
                        })}
                    </div>
                    <Button name="Verify OTP" />
                    <p> Didn’t get the code yet?
                        <button id="resetOtpBtn" type="button" className="text-ash font-bold ml-2 cursor-default">Send Again in <strong id="counter">{timer}</strong> {second}</button>

                        <button id="resetOtpBtnActive" onClick={resendOtp} type="button" className="hidden font-bold text-primary ml-2">
                            Send Again <ImArrowRight2 className='inline ml-1' />
                        </button>
                    </p>
                    <p onClick={goBack} className="cursor-pointer"><span to="/login" className="font-bold text-primary"><ImArrowRight2 className='inline ml-1 mb-0.5 rotate-180' /> Change Number?</span> </p>
                </form>
            </div>
        </div>
    );

}