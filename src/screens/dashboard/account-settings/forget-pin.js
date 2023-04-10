import React, { useEffect, useState } from 'react';
import Button from './../../../components/Button';

import ShowPasswordOpen from "./../../../assets/icons/show-password-icon-open.png";
import ShowPasswordClose from "./../../../assets/icons/show-password-icon-close.png";
import OtpSpace from './../../../assets/icons/otp-space.png';


import { ImArrowRight2 } from "react-icons/im";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import $, { event } from "jquery";
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.min.css';


import PostLoginPostApi from '../../../components/api/PostLoginPostApi';


export default function ForgetPin(props) {

    const [otp, setOtp] = useState(new Array(6).fill(""));

    const [pin, setPin] = useState({
        date_of_birth: "",
        otp: "",
        newPin: "",
        confirmPin: ""
    });

    useEffect(() => {
        $("#singleDatePicker").datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            maxDate: 0
        });

    }, []);

    // Timer
    const [timer3, setTimer3] = useState(process.env.REACT_APP_RESEND_OTP_TIMER * 1);
    useEffect(() => {
        if (timer3 <= 0) {
            $("#resetOtpBtn").hide();
            $("#resetOtpBtnActive").show();
        };

        const timerInterval = setInterval(() => {
            setTimer3(timer3 - 1);
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [timer3]);


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

    const resendOtp = async () => {
        if (pin.date_of_birth === "") {
            resetFormData();
            return;
        }

        try {
            await PostLoginPostApi("api/v1/auth/forgot-pin/send-otp", JSON.stringify(pin.date_of_birth), 0).then(() => {
                toast.success("OTP has been resend on your mobile number.");
            });
        }
        catch (exception) {
            toast.error("A problem occur. Please try again.");
            console.log(exception);
        }
    }

    const handleOtpSubmit = (event) => {

        event.preventDefault();
        var otpString = otp.join('');
        if (otpString.length === 6) {


            PostLoginPostApi("api/v1/auth/forgot-pin/verify-otp", JSON.stringify({ ...pin, otp: otpString }), 0).then((responseJson) => {

                let response = JSON.stringify(responseJson);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        setPin({ ...pin, otp: otpString });

                        $("#pin-form").hide();
                        $("#pin-otp-form").hide();
                        $("#new-pin-set-form").show();

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

    const handleSubmit = (e) => {
        e.preventDefault();

        var dt = $("#singleDatePicker").val();
        if (dt === "") {
            toast.error("Please choose company registration date.");
            return;
        }


        // API CALL
        const reqBody = { date_of_birth: dt };

        PostLoginPostApi("api/v1/auth/forgot-pin/send-otp", JSON.stringify(reqBody), 0).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    setPin({ ...pin, date_of_birth: dt });
                    $("#pin-form").hide();
                    $("#pin-otp-form").show();
                    $("#new-pin-set-form").hide();

                    setTimer3(process.env.REACT_APP_RESEND_OTP_TIMER);
                    return;
                }


                toast.error(responseData["messages"].toString());
                return;
            }

            toast.error("A problem occur while checking the Registration Date. Please try again.");
            return;

        }).catch((error) => {
            toast.error("A problem occur. Please try again.");
            console.log(error);
        });


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

        $("#pin-form, #pin-otp-form, #new-pin-set-form").find("input[type=password], input[type=text]").val("");

        $("#pin-form").show();
        $("#pin-otp-form, #new-pin-set-form").hide();
    }


    const handleNewPinSetSubmit = (event) => {
        event.preventDefault();

        if (pin.newPin.length !== 4) {
            toast.error("PIN must be 4 character long.");
            return;
        }


        if (pin.newPin !== pin.confirmPin) {
            toast.error("PIN and Confirm PIN does not match.");
            return;
        }


        const reqBody = { pin: pin.newPin, pin_confirmation: pin.confirmPin, date_of_birth: pin.date_of_birth, otp: pin.otp }
        try {
            PostLoginPostApi("api/v1/auth/forgot-pin/reset", JSON.stringify(reqBody), 0).then((responseJson) => {
                let response = JSON.stringify(responseJson);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        $("#pin-form").hide();
                        $("#pin-otp-form").hide();
                        $("#new-pin-set-form").show();

                        toast.success("PIN has been reset successfully.");
                        resetFormData();

                        setTimeout(() => {
                            document.location.reload();
                        }, 2000);

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
        }
        catch (ex) {
            toast.error("A problem occur while setting the new PIN.");
            console.log(ex);
        }
    }

    return (
        <>
            <h1 className="font-bold text-lg mb-3 px-2">{props.title}</h1>

            {/* REQUEST VERIFY */}
            <form method="POST" id="pin-form" onSubmit={handleSubmit} className="form-body max-w-[650px]" autoComplete='off'>
                <table className="custom-details-table w-full mt-0 mb-5 no-hover">
                    <tbody>
                        <tr title="Choose Company Registration Date">
                            <td className="font-semibold text-base w-2/4">
                                Owner's Date of Birth
                            </td>
                            <td className="px-0 text-base w-2/4">
                                <div className="relative bg-white rounded-md">
                                    <input type="text" autoComplete='off' id="singleDatePicker" name="singleDatePicker" placeholder="Choose Owner's Date of Birth" className='border-none w-full' required />
                                </div>
                            </td>
                        </tr>

                    </tbody>
                </table>
                <Button name="Next" className="mt-3" />
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
                            <button id="resetOtpBtn" type="button" className="text-ash font-bold ml-2 cursor-default">Send Again in <strong id="counter">{timer3}</strong> seconds</button>

                            <button id="resetOtpBtnActive" onClick={resendOtp} type="button" className="hidden font-bold text-primary ml-2">
                                Send Again <ImArrowRight2 className='inline ml-1' />
                            </button>
                        </p>
                    </div>
                </div>
            </form>

            {/* NEW PIN */}
            <form method="POST" id="new-pin-set-form" onSubmit={handleNewPinSetSubmit} className="form-body max-w-[650px] hidden" autoComplete='off'>
                <table className="custom-details-table w-full mt-0 mb-5 no-hover">
                    <tbody>
                        <tr>
                            <td className="font-semibold text-base">
                                New PIN
                            </td>
                            <td className="px-0 text-base">
                                <div className="relative bg-white rounded-md">
                                    <input type="password" name="newPin" id="newPin" minLength={4} maxLength={4} value={pin.newPin || ""} onChange={(e) => handleChange(e.target)} autoComplete='off' className="custom-text-replace block pl-2.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " required />

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
                                    <input type="password" name="confirmPin" id="confirmPin" minLength={4} maxLength={4} value={pin.confirmPin || ""} onChange={(e) => handleChange(e.target)} autoComplete='off' className="custom-text-replace block pl-2.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " required />

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

            <style jsx="true">{`
            .ui-datepicker .ui-datepicker-prev, .ui-datepicker .ui-datepicker-next {
                height: 3em !important;
            }

            #ui-datepicker-div {
                width: 321px !important;
            }
            `}</style>


        </>
    )
}
