import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputMask from "react-input-mask";
import Button from '../../components/Button';

import { ImArrowRight2 } from "react-icons/im";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function StepOne(props) {

    const [mobileNumber, setMobileNumber] = useState('')
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [apiData, setApiData] = useState([]);

    let navigate = useNavigate();

    async function fetchData(param) {
        await fetch(process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_PREFIX + "forgot-password/send-otp", {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),

            body: JSON.stringify({
                mobile_number: param,
            })

        }).then(res => res.json()).then(
            (result) => {
                setIsLoaded(true);
                setApiData(result);
                setMobileNumber(param);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        );
    }


    useEffect(() => {
        window.history.replaceState({}, "");

        if (isLoaded === true) {
            if (error) {
                toast.error(error.messages.toString());
                return;
            }

            let response = JSON.stringify(apiData);
            response = JSON.parse(response);

            if (response["code"] === 200) {
                navigate("/forget-password-step-two", {
                    state: {
                        mobileNumber: mobileNumber
                    }
                });
                return;
            }

            toast.error(response["messages"].toString());
        }

    }, [apiData]);


    const handleSubmit = e => {
        e.preventDefault();

        var mobileNumberFinal = mobileNumber.split(" ").join("");

        if (mobileNumberFinal.length !== 14) {
            toast.error("Please enter valid phone number.");
            return;
        }

        fetchData(mobileNumberFinal);
    }



    return (
        <div className="w-3/5">
            <ToastContainer />
            <h1 className="font-bold text-4xl mb-8">{props.title}</h1>
            <div className="bg-neutral-100 p-9 text-secondary ">
                <p className="mb-5">{props.subtitle}</p>
                <form onSubmit={handleSubmit} method="POST" className="form-body">
                    <div className="relative mb-4 bg-white px-2 rounded-md">
                        <InputMask mask="+880 999 999 9999" value={mobileNumber} id={props.name} type={props.type} name={props.name} onChange={(e) => setMobileNumber(e.target.value)} className="block pl-0.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " required />

                        <label htmlFor={props.name} className="absolute text-base pt-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-2.5 peer-focus:text-[#34A853] peer-focus:dark:text-[#34A853] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 ">{props.placeholder}</label>
                    </div>
                
                    <Button name={props.btnName} />
                    <p>Remember your password? <Link to="/" className="font-bold text-primary">Back to login <ImArrowRight2 className='inline' /></Link> </p>
                </form>
            </div>
        </div>
    );

}