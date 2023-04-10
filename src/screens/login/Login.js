import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import InputMask from "react-input-mask";
import Button from '../../components/Button';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PreLoginApi from "../../components/api/PreLoginApi";
import $ from "jquery";

import ShowPasswordOpen from "./../../assets/icons/show-password-icon-open.png";
import ShowPasswordClose from "./../../assets/icons/show-password-icon-close.png";
import SignUpOrLogin from '../../components/SignUpOrLogin';

var CryptoJS = require("crypto-js");

const Login = (props) => {

    const { state } = useLocation();
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [apiData, setApiData] = useState([]);

    let [input, setInput] = useState({
        mobileNumber: "",
        password: ""
    });



    useEffect(() => {

        if (state !== null) {
            if (state.passwordChangeMessage !== null && state.passwordChangeMessage !== undefined && state.passwordChangeMessage !== "") {
                toast.success(state.passwordChangeMessage.toString());
            }
        }
        window.history.replaceState({}, "");

        if (isLoaded === true) {
            if (error) {
                toast.error(error.messages);
                return;
            }

            let response = JSON.stringify(apiData);
            response = JSON.parse(response);
            if (response["code"] === 200) {
                toast.success(response["data"]["message"]);

                if (response["data"]["token"] !== undefined) {

                    // Call Invoice Token
                    fetch(process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_PREFIX_PRIVATE + "deshi-invoice-token", {
                        method: "GET",
                        headers: new Headers({
                            "Content-Type": "application/x-www-form-urlencoded",
                            'Accept': 'application/json',
                            'Authorization': 'Bearer ' + response["data"]["token"]
                        })
                    });


                    // If first login then force password update.
                    if (response["data"]["is_first_login"] === 1) {

                        const reqData = { mobile_number: input.mobileNumber.split(' ').join('') }

                        PreLoginApi("forgot-password/send-otp", JSON.stringify(reqData)).then((responseText) => {

                            let responseJSON = JSON.stringify(responseText);
                            responseJSON = JSON.parse(responseJSON);

                            if (responseJSON["status"] === 1) {
                                console.log('inside login');

                                let responseData = JSON.stringify(responseJSON["data"]);
                                responseData = JSON.parse(responseData);

                                if (responseData["code"] === 200) {
                                    navigate('/force/otp', {
                                        state: {
                                            mobileNumber: input.mobileNumber.split(' ').join(''),
                                            reqToken: response['data']['token']
                                        }
                                    });
                                    return;
                                }
                            }

                        });

                        toast.error("A problem occur. Please try again.");
                        return;
                    }




                    // PostLoginGetApi("deshi-invoice-token").then((responseJSON) => {
                    //     let response = JSON.stringify(responseJSON);
                    //     response = JSON.parse(response);

                    //     if (response["status"] === 1) {
                    //         let responseData = JSON.stringify(response["data"]);
                    //         responseData = JSON.parse(responseData);

                    //         if (responseData["code"] === 200) {
                    //             setIsInvoiceCall(true);
                    //         }
                    //     }

                    // }).catch((err) => {
                    //     console.log(err);
                    // });

                    // Redirect to Dashboard if not first login
                    let token = CryptoJS.AES.encrypt(JSON.stringify(response["data"]), process.env.REACT_APP_SECURITY_SALT).toString();
                    window.localStorage.setItem("UserToken", token);
                    document.location.href = "/dashboard/home";
                    return;
                }
            }

            toast.error(response["messages"].toString());
        }


        $("#mobileNumber").trigger("focus");

    }, [apiData, isLoaded]);


    let handleInputChange = (e) => {
        setInput({ ...input, [e.name]: e.value });
    }

    let handleSubmit = async (event) => {
        event.preventDefault();

        let mobileNumberFinal = input.mobileNumber.split(" ").join("");
        mobileNumberFinal = mobileNumberFinal.replace("_", "");

        if (mobileNumberFinal.length !== 14) {
            toast.error("Please enter valid phone number.");
            return;
        }

        if (input.password.length < 8 || input.password.length > 32) {
            toast.error("Password must be between 8 to 32 character long.");
            return;
        }

        // if (mobileNumberFinal.indexOf("1") !== 4) {
        //     toast.error("Phone number must start with +8801*******");
        //     return
        // }

        try {
            let req_body = JSON.stringify({ mobile_number: mobileNumberFinal, password: input.password });
            PreLoginApi("signin", req_body).then((responseJSON) => {
                setIsLoaded(true);

                var response = JSON.stringify(responseJSON);
                response = JSON.parse(response);
                if (response["status"] === 1) {
                    setApiData(response["data"]);
                    return;
                }

                setError(response["data"]);
            }).catch((error) => {
                toast.error(error);
                console.log(error.message);
            });
        }
        catch (err) {
            toast.error(err);
            console.log(err);
        }
    }


    var showPassword = (id) => {
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


    return (
        <div className="w-3/5">
            <ToastContainer />
            <h1 className="font-bold text-4xl mb-8">{props.title}</h1>
            <SignUpOrLogin />

            <div className="bg-neutral-100 px-9 py-7 text-secondary rounded-md">
                <p className="mb-5">{props.subtitle}</p>
                <form onSubmit={handleSubmit} method="POST" className="form-body">

                    <div className="mb-4">
                        <div className="relative mb-4 bg-white px-2 rounded-md">
                            <InputMask type="text" mask="+880 999 999  9999" id={props.name1} name={props.name1} value={input.mobileNumber} autoComplete='off' onChange={(e) => handleInputChange(e.target)} className="block pl-0.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " required />
                            <label htmlFor={props.name1} className="absolute text-base pt-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1.5 z-10 origin-[0] left-2.5 peer-focus:text-[#34A853] peer-focus:dark:text-[#34A853] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3" style={{lineHeight: "2.5rem"}}>{props.placeholder1}</label>
                        </div>

                        <div className="relative mb-4 bg-white px-2 rounded-md">
                            <input type="password" minLength={8} maxLength={32} id={props.name2} name={props.name2} value={input.password} autoComplete='off' onChange={(e) => handleInputChange(e.target)} className="block pl-0.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white  border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " />

                            <label htmlFor={props.name2} className="absolute text-base pt-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1.5 z-10 origin-[0] left-2.5 peer-focus:text-[#34A853] peer-focus:dark:text-[#34A853] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3" style={{lineHeight: "2.5rem"}}>{props.placeholder2}</label>

                            <img alt="Show Password" className="show-password-icon" src={ShowPasswordOpen} onClick={() => showPassword(props.name2)}></img>
                            <img alt="Show Password" style={{ display: "none", marginTop: "-36px", marginRight: "7px" }} className="show-password-icon" src={ShowPasswordClose} onClick={() => showPassword(props.name2)}></img>
                        </div>
                    </div>
                    <Button name={props.btnName} />
                    <Link to="/forget-password-step-one" className='font-bold text-primary inline-block mt-1'>Forgot Password?</Link>
                </form>
            </div>
        </div>
    );
}


export default Login;

