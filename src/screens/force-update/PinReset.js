import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/Button';

import { ImArrowRight2 } from "react-icons/im";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import $ from "jquery";


import ShowPasswordOpen from "./../../assets/icons/show-password-icon-open.png";
import ShowPasswordClose from "./../../assets/icons/show-password-icon-close.png";
import PreLoginApi from "../../components/api/PreLoginApi";


var CryptoJS = require("crypto-js");


export default function PinReset(props) {

    const [pin, setPin] = useState({
        pin: "",
        confirmPin: ""
    });
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [apiData, setApiData] = useState([]);
    const [reqToken, setReqToken] = useState("");

    const [isLoginData, setIsLoginData] = useState([]);

    let navigate = useNavigate();
    const { state } = useLocation();


    useEffect(() => {

        // Check page access is valid or not
        if (state === null || state.mobileNumber === null || state.mobileNumber === undefined || state.mobileNumber === "" || state.password === null || state.password === undefined || state.password === "") {
            navigate("/login");
            return;
        }

        if (isLoginData.length === 0) {
            var req_body = JSON.stringify({ mobile_number: state.mobileNumber.split(" ").join(""), password: state.password });
            PreLoginApi("signin", req_body).then((responseJSON) => {
                var response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                setIsLoginData(response["data"]);

                if (response["status"] === 1) {
                    setIsLoginData(response["data"]["data"]);
                    setReqToken(response["data"]["data"]["token"]);
                }
            });
        }



        if (isLoaded === true) {
            if (error) {
                if (error.toString().includes("TypeError")) {
                    navigate("/");
                    return;
                }

                toast.error(error.toString());
                return;
            }

            let response = JSON.stringify(apiData);
            response = JSON.parse(response);

            if (response["code"] === 200) {
                let token = CryptoJS.AES.encrypt(JSON.stringify(isLoginData), process.env.REACT_APP_SECURITY_SALT).toString();
                window.localStorage.setItem("UserToken", token);
                navigate("/dashboard/home", {
                    state: {
                        success: "PIN has been reset successfully."
                    }
                });
                return;
            }

            toast.error(response["messages"][0]);
        }

    }, [apiData, error, isLoaded, navigate, state, isLoginData]);


    async function fetchData() {
        try {
            await fetch(process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_PREFIX + "first-time-pin/setup", {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + reqToken
                }),
                body: JSON.stringify({
                    pin: pin.pin,
                    pin_confirmation: pin.confirmPin
                })
            }).then(res => res.json()).then(
                (result) => {
                    setApiData(result);
                },
                (error) => {
                    setError(error);
                }
            );
        }
        catch (e) {
            console.log(e);
            setError(e.messages.toString());
        }
        finally {
            setIsLoaded(true);
        }
    }


    var handleChange = (e) => {
        const re = /^[0-9\b]+$/;

        if (e.value === '' || re.test(e.value)) {
            setPin({ ...pin, [e.name]: e.value });
        }
    }

    const handleSubmit = e => {
        e.preventDefault();

        if (pin.pin.length !== 4) {
            toast.error("PIN must be 4 character long.");
            return;
        }

        if (pin.pin === pin.confirmPin) {
            fetchData();
            return;
        }

        toast.error("PIN and Confirm PIN does not match.");
        return;
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
            <div className="bg-neutral-100 p-9 text-secondary ">
                <p className="mb-5">{props.subtitle}</p>
                <form onSubmit={handleSubmit} method="POST" className="form-body" autoComplete='off'>


                    <div className="relative mb-4 bg-white px-2 rounded-md">
                        <input type={props.type1} name={props.name1} id={props.name1} minLength={4} maxLength={4} value={pin.pin} onChange={(e) => handleChange(e.target)} autoComplete='off' className="custom-text-replace block pl-0.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " required />

                        <label htmlFor={props.name1} className="absolute text-base pt-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-2.5 peer-focus:text-[#34A853] peer-focus:dark:text-[#34A853] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">{props.placeholder1}</label>

                        <img alt="Show Password" className="show-password-icon" src={ShowPasswordOpen} onClick={() => showPassword(props.name1)}></img>
                        <img alt="Show Password" style={{ display: "none", marginTop: "-36px", marginRight: "7px" }} className="show-password-icon" src={ShowPasswordClose} onClick={() => showPassword(props.name1)}></img>
                    </div>

                    <div className="relative mb-4 bg-white px-2 rounded-md">
                        <input type={props.type2} name={props.name2} id={props.name2} minLength={4} maxLength={4} onChange={(e) => handleChange(e.target)} autoComplete='off' className="block pl-0.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " required />

                        <label htmlFor={props.name2} className="absolute text-base pt-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-2.5 peer-focus:text-[#34A853] peer-focus:dark:text-[#34A853] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">{props.placeholder2}</label>
                    </div>

                    <Button name={props.btnName} />

                </form>
            </div>


        </div>
    );
}