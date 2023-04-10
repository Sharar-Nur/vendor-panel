import React, { useEffect, useState } from 'react';
import Button from './../../../components/Button';

import ShowPasswordOpen from "./../../../assets/icons/show-password-icon-open.png";
import ShowPasswordClose from "./../../../assets/icons/show-password-icon-close.png";
import OtpSpace from './../../../assets/icons/otp-space.png';


import { ImArrowRight2 } from "react-icons/im";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import $ from "jquery";
import PostLoginPostApi from '../../../components/api/PostLoginPostApi';


export default function ChangePin() {

    const [otp, setOtp] = useState(new Array(6).fill(""));

    const [pin, setPin] = useState({
        currentPin: "",
        newPin: "",
        confirmPin: ""
    });

    // Timer
    const [timer, setTimer] = useState(90);
    useEffect(() => {
        if (timer <= 0) {
            $("#resetOtpBtn").hide();
            $("#resetOtpBtnActive").show();
        };

        const timerInterval = setInterval(() => {
            setTimer(timer - 1);
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [timer]);


    const handleOtpChange = (element, index) => {
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

    const resendOtp = () => {
    }

    const handleOtpSubmit = (event) => {

        event.preventDefault();
        var otpString = otp.join('');
        if (otpString.length === 6) {


            var oldBody = sessionStorage.getItem("old_body");
            oldBody = JSON.parse(oldBody);

            const reqBody = {
                old_pin: oldBody.old_pin,
                pin: oldBody.pin,
                pin_confirmation: oldBody.pin_confirmation,
                otp: otpString
            };


            PostLoginPostApi("api/v1/auth/pin-change/step-2", JSON.stringify(reqBody), 0).then((responseJson) => {

                let response = JSON.stringify(responseJson);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        $("#pin-form").show();
                        $("#pin-otp-form").hide();

                        toast.success("PIN change successfully.");
                        return;
                    }

                    toast.error(responseData["messages"].toString());
                    return;
                }

                toast.error("A problem occur. Please try again.");
                return;

            }).catch((error) => {
                toast.error("A problem occur. Please try again.");
                console.log(error);
            });

            return;
        }

        toast.error("Please fill up OTP fields.");
        return;
    }

    const handleChange = (e) => {
        const re = /^[0-9\b]+$/;

        if (e.value === '' || re.test(e.value)) {
            setPin({ ...pin, [e.name]: e.value });
        }
    }

    const handleSubmit = e => {
        e.preventDefault();

        if (pin.currentPin.length !== 4) {
            toast.error("PIN must be 4 character long.");
            return;
        }

        if (pin.newPin === pin.confirmPin) {

            var reqBody = {
                old_pin: pin.currentPin,
                pin: pin.newPin,
                pin_confirmation: pin.confirmPin
            };

            sessionStorage.setItem("old_body",JSON.stringify(reqBody));

            resetFormData();

            PostLoginPostApi("api/v1/auth/pin-change/step-1", JSON.stringify(reqBody), 0).then((responseJson) => {
                let response = JSON.stringify(responseJson);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        $("#pin-form").hide();
                        $("#pin-otp-form").show();
                        return;
                    }

                    toast.error(responseData["messages"].toString());
                    return;
                }

                toast.error("A problem occur. Please try again.");
                return;
            }).catch((error) => {
                toast.error("A problem occur. Please try again.");
                console.log(error);
            });

            return;
        }


        toast.error("PIN and Confirm PIN does not match.");
        return;
    }

    const showCurrentPassword = (id) => {
        $(".show-current-pass-icon").hide();

        if ($("#" + id).attr("type") === "text") {
            $(".show-current-pass-icon").eq(0).show();
            $("#" + id).attr("type", "password");
            return;
        }

        $(".show-current-pass-icon").eq(1).show();
        $("#" + id).attr("type", "text");
        return;
    }

    const showPassword = (id) => {
        $(".show-password-icon").hide();

        if ($("#" + id).attr("type") === "text") {
            $(".show-password-icon").eq(0).show();
            $("#" + id).attr("type", "password");
            return;
        }

        $(".show-password-icon").eq(1).show();
        $("#" + id).attr("type", "text");
        return;
    }

    const showConfirmPassword = (id) => {
        $(".show-confirm-pass-icon").hide();

        if ($("#" + id).attr("type") === "text") {
            $(".show-confirm-pass-icon").eq(0).show();
            $("#" + id).attr("type", "password");
            return;
        }

        $(".show-confirm-pass-icon").eq(1).show();
        $("#" + id).attr("type", "text");
        return;
    }


    const resetFormData = () => {
        setPin([]);
        setOtp(new Array(6).fill(""));

        $("#pin-form").find("input[type=password], input[type=text]").val("");
        $("#pin-otp-form").find("input[type=password], input[type=text]").val("");
    }

    return (
        <>
            <h1 className="font-bold text-lg mb-3 px-2">Change PIN</h1>

            {/* REQUEST CHANGE PIN */}
            <form method="POST" id="pin-form" onSubmit={handleSubmit} className="form-body max-w-[650px]" autoComplete='off'>
                <table className="custom-details-table w-full mt-0 mb-5 no-hover">
                    <tbody>
                        <tr>
                            <td className="font-semibold text-base">
                                Current PIN
                            </td>
                            <td className="px-0 text-base">
                                <div className="relative bg-white rounded-md">
                                    <input type="password" name="currentPin" id="currentPin" minLength={4} maxLength={4} value={pin.currentPin} onChange={(e) => handleChange(e.target)} autoComplete='off' className="custom-text-replace block pl-2.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " required />

                                    <label htmlFor="currentPin" className="absolute text-base pt-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-2.5 peer-focus:text-[#34A853] peer-focus:dark:text-[#34A853] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">Enter Current PIN</label>

                                    <img alt="Show Password" className="show-current-pass-icon" src={ShowPasswordOpen} onClick={() => showCurrentPassword("currentPin")}></img>
                                    <img alt="Show Password" style={{ display: "none", marginTop: "-36px", marginRight: "7px" }} className="show-current-pass-icon" src={ShowPasswordClose} onClick={() => showCurrentPassword("currentPin")}></img>

                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="font-semibold text-base">
                                New PIN
                            </td>
                            <td className="px-0 text-base">
                                <div className="relative bg-white rounded-md">
                                    <input type="password" name="newPin" id="newPin" minLength={4} maxLength={4} value={pin.newPin} onChange={(e) => handleChange(e.target)} autoComplete='off' className="custom-text-replace block pl-2.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " required />

                                    <label htmlFor="newPin" className="absolute text-base pt-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-2.5 peer-focus:text-[#34A853] peer-focus:dark:text-[#34A853] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">Enter New PIN</label>

                                    <img alt="Show Password" className="show-password-icon" src={ShowPasswordOpen} onClick={() => showPassword("newPin")}></img>
                                    <img alt="Show Password" style={{ display: "none", marginTop: "-36px", marginRight: "7px" }} className="show-password-icon" src={ShowPasswordClose} onClick={() => showPassword("newPin")}></img>

                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="font-semibold text-base">
                                Confirm New PIN
                            </td>
                            <td className="px-0 text-base">
                                <div className="relative bg-white rounded-md">
                                    <input type="password" name="confirmPin" id="confirmPin" minLength={4} maxLength={4} value={pin.confirmPin} onChange={(e) => handleChange(e.target)} autoComplete='off' className="custom-text-replace block pl-2.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " required />

                                    <label htmlFor="confirmPin" className="absolute text-base pt-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-2.5 peer-focus:text-[#34A853] peer-focus:dark:text-[#34A853] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">Enter Confirm PIN</label>

                                    <img alt="Show Password" className="show-confirm-pass-icon" src={ShowPasswordOpen} onClick={() => showConfirmPassword("confirmPin")}></img>
                                    <img alt="Show Password" style={{ display: "none", marginTop: "-36px", marginRight: "7px" }} className="show-confirm-pass-icon" src={ShowPasswordClose} onClick={() => showConfirmPassword("confirmPin")}></img>




                                </div>
                            </td>
                        </tr>

                    </tbody>
                </table>
                <Button name="Submit" className="mt-3" />
            </form>





            {/* OTP */}
            <form method="POST" id="pin-otp-form" onSubmit={handleOtpSubmit} className="form-body max-w-[650px] pt-4 hidden" style={{ borderTop: "1px dotted #F5F5F5" }} autoComplete='off'>
                <p className="float-left text-lg px-4 font-medium pb-0 pl-6">Enter OTP</p>

                <div className="flow-root w-full py-3 bg-white rounded-md  px-6" style={{ boxShadow: "0px 4px 10px rgb(0 0 0 / 5%)" }}>


                    <div className="relative bg-white rounded-md">
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
                                                handleOtpChange(e.target, index);
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
                        <p>Didn’t get the code yet?
                            <button id="resetOtpBtn" type="button" className="text-ash font-bold ml-2 cursor-default">Send Again in <strong id="counter">{timer}</strong> seconds</button>

                            <button id="resetOtpBtnActive" onClick={resendOtp} type="button" className="hidden font-bold text-primary ml-2">
                                Send Again <ImArrowRight2 className='inline ml-1' />
                            </button>
                        </p>
                    </div>
                </div>
            </form>

        </>
    )
}

