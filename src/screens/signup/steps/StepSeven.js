import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from "../../../components/Button";

import { ImArrowRight2 } from "react-icons/im";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import $ from "jquery";
import ShowPasswordOpen from "../../../assets/icons/show-password-icon-open.png";
import ShowPasswordClose from "../../../assets/icons/show-password-icon-close.png";
import PreLoginPostApi from '../../../components/api/PreLoginPostApi';



export default function StepSeven(props) {

    const [password, setPassword] = useState({
        password: "",
        confirmPassword: ""
    });

    let navigate = useNavigate();
    const { state } = useLocation();


    useEffect(() => {
        if (state === null || state.accept === "" || state.accept === undefined || state.accept === null
            || state.mobile_number === "" || state.mobile_number === undefined || state.mobile_number === null
            || state.email === "" || state.email === undefined || state.email === null
            || state.name === "" || state.name === undefined || state.name === null
            || state.otp === "" || state.otp === undefined || state.otp === null
            || state.organization_type_id === "" || state.otp === undefined || state.otp === null
            || state.business_category_id === "" || state.business_category_id === undefined || state.business_category_id === null) {
            window.history.replaceState({}, "");
            navigate('/signup/step-one');
            return;
        }
    })


    var handleChange = (e) => {
        setPassword({ ...password, [e.name]: e.value })
    }

    const handleSubmit = e => {
        e.preventDefault();

        if (password.password.length < 8 || password.password.length > 32) {
            toast.error("Password must be between 8 to 32 character long.");
            return;
        }

        if (password.password !== password.confirmPassword) {
            toast.error("Password and Confirm Password does not match.");
            return;
        }


        const signupObject = {
            mobile_number: state.mobile_number,
            name: state.name,
            email: state.email,
            password: password.password,
            password_confirmation: password.confirmPassword,
            accept: state.accept,
            otp: state.otp,
            organization_type_id: state.organization_type_id,
            business_category_id: state.business_category_id
        }

        try {
            PreLoginPostApi('signup/completion', JSON.stringify(signupObject))
                .then((res) => {
                    if (res.data.code === 200) {
                        navigate('/signup/step-eight', {
                            state: {
                                meta: res.data,
                                mobile_number: state.mobile_number,
                                password: password.password
                            }
                        })
                    } else {
                        toast.error(res.data.messages[0])
                    }
                })

        } catch (err) {
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

    const goBack = () => {
        navigate("/signup/step-six", {
            state: {
                mobile_number: state.mobile_number,
                email: state.email,
                name: state.name,
                otp: state.otp,
                accept: state.accept

            }
        })
    }


    return (
        <div className="w-3/5">
            <ToastContainer />
            <h1 className="font-bold text-4xl mb-8">{props.title}</h1>
            <div className="bg-neutral-100 p-9 text-secondary ">
                <p className="mb-5 ">{props.subtitle}</p>
                <p className="mb-5">*Password must contain at least one uppercase letter <br /> *One lowercase letter <br /> *One number <br />*One special character (e.g. $ % & _ + - . @ #)</p>
                <form onSubmit={handleSubmit} method="POST" className="form-body" autoComplete='off'>


                    <div className="relative mb-4 bg-white px-2 rounded-md">
                        <input type={props.type1} name={props.name1} id={props.name1} minLength={8} maxLength={32} onChange={(e) => handleChange(e.target)} autoComplete='off' className="block pl-0.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " required />

                        <label htmlFor={props.name1} className="absolute text-base pt-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-2.5 peer-focus:text-[#34A853] peer-focus:dark:text-[#34A853] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">{props.placeholder1}</label>



                        <img alt="Show Password" className="show-password-icon" src={ShowPasswordOpen} onClick={() => showPassword(props.name1)}></img>
                        <img alt="Show Password" style={{ display: "none", marginTop: "-36px", marginRight: "7px" }} className="show-password-icon" src={ShowPasswordClose} onClick={() => showPassword(props.name1)}></img>

                    </div>

                    <div className="relative mb-4 bg-white px-2 rounded-md">
                        <input type={props.type2} name={props.name2} id={props.name2} minLength={8} maxLength={32} onChange={(e) => handleChange(e.target)} autoComplete='off' className="block pl-0.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " required />

                        <label htmlFor={props.name2} className="absolute text-base pt-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-2.5 peer-focus:text-[#34A853] peer-focus:dark:text-[#34A853] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">{props.placeholder2}</label>

                        <img alt="Show Password" className="show-confirm-pass-icon" src={ShowPasswordOpen} onClick={() => showConfirmPassword("confirmPassword")}></img>
                        <img alt="Show Password" style={{ display: "none", marginTop: "-36px", marginRight: "7px" }} className="show-confirm-pass-icon" src={ShowPasswordClose} onClick={() => showConfirmPassword("confirmPassword")}></img>
                    </div>

                    <Button name={props.btnName} />

                    {/* <button type="button" id="back" onClick={goBack} className="active">Back</button> */}
                    <p onClick={goBack} className="cursor-pointer"><span className="font-bold text-primary"><ImArrowRight2 className='inline ml-1 mb-0.5 rotate-180' /> Go Back?</span> </p>
                </form>
            </div>
        </div>
    );

}