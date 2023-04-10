import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/Button';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from "jquery";

import ShowPasswordOpen from "./../../assets/icons/show-password-icon-open.png";
import ShowPasswordClose from "./../../assets/icons/show-password-icon-close.png";


export default function PasswordReset(props) {
    
    const [password, setPassword] = useState({
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [apiData, setApiData] = useState([]);
    const [mobileNumber, setMobileNumber] = useState("");
    const [reqToken, setReqToken] = useState("");

    let navigate = useNavigate();
    const { state } = useLocation();


    useEffect(()=>{

        // Check page access is valid or not
        if( state === null || state.mobileNumber === null || state.mobileNumber === undefined || state.mobileNumber === "" || state.reqToken === null || state.reqToken === undefined || state.reqToken === "" || state.otpNumber === null || state.otpNumber === undefined || state.otpNumber === "") {
            navigate("/login-otp");
            return;
        }

        setMobileNumber(state.mobileNumber.split(" ").join(""));
        setReqToken(state.reqToken);


        window.history.replaceState({}, "");

        if( isLoaded === true ) {
            if( error ) {
                if( error.toString().includes("TypeError") ) {
                    navigate("/");
                    return;
                }

                toast.error(error.toString());
                return;
            }

            let response = JSON.stringify(apiData);
            response = JSON.parse(response);

            if(response["code"] === 200) {
                navigate("/force/pin-reset", {
                    state: {
                        passwordChangeMessage: "Password update successfully.",
                        mobileNumber: mobileNumber,
                        reqToken: reqToken,
                        password: password.password
                    }
                });
                return;
            }

            toast.error(response["messages"].toString());
        }

    },[apiData, error, isLoaded]);


    async function fetchData() {
        try {
            await fetch(process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_PREFIX + "first-time-password/set", {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ reqToken
                }),
    
                body: JSON.stringify({
                    otp: state.otpNumber.join(''),
                    mobile_number: mobileNumber,
                    password: password.password,
                    password_confirmation: password.confirmPassword
                })
            }).then(res => res.json()).then( 
                (result)=>{
                    setApiData(result);
                },
                (error)=>{
                    setError(error);
                }
            );
        }
        catch(e) {
            setError(e.messages);
        }
        finally {
            setIsLoaded(true);
        }
    }

    var handleChange = (e) => {
        setPassword({...password, [e.name]: e.value})
    }

    const handleSubmit = e => {
        e.preventDefault();

        if(password.password.length < 8 || password.password.length > 32 ) {
            toast.error("Password must be between 8 to 32 character long.");
            return;
        }
        
        if(password.password === password.confirmPassword) {
            fetchData();
            return;
        }
        
        toast.error("Password and confirm password does not match.");
        return;
    }
    

    var showPassword = (id) => {
        $(".show-password-icon").hide();

        if( $("#"+id).attr("type") === "text" ) {
            $(".show-password-icon").eq(0).show();
            $("#"+id).attr("type","password");
            return;
        }

        $(".show-password-icon").eq(1).show();
        $("#"+id).attr("type","text");
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
                        <input type={props.type1} name={props.name1} id={props.name1} minLength={8} maxLength={32} onChange={(e)=>handleChange(e.target)} autoComplete='off' className="block pl-0.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " required />
                        
                        <label htmlFor={props.name1} className="absolute text-base pt-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-2.5 peer-focus:text-[#34A853] peer-focus:dark:text-[#34A853] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">{props.placeholder1}</label>

                        <img alt="Show Password" className="show-password-icon" src={ShowPasswordOpen} onClick={()=>showPassword(props.name1)}></img>
                        <img alt="Show Password" style={{display: "none", marginTop: "-36px", marginRight: "7px"}} className="show-password-icon" src={ShowPasswordClose} onClick={()=>showPassword(props.name1)}></img>

                    </div>

                    <div className="relative mb-4 bg-white px-2 rounded-md">
                        <input type={props.type2} name={props.name2} id={props.name2} minLength={8} maxLength={32} onChange={(e)=>handleChange(e.target)} autoComplete='off' className="block pl-0.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " required />
                        
                        <label htmlFor={props.name2} className="absolute text-base pt-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-2.5 peer-focus:text-[#34A853] peer-focus:dark:text-[#34A853] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">{props.placeholder2}</label>
                    </div>

                    <Button name={props.btnName} />

                </form>
            </div>
        </div>
    );
}