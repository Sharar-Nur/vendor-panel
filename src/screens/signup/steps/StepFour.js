import React, { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { ImArrowRight2 } from "react-icons/im";
import PreLoginPostApi from '../../../components/api/PreLoginPostApi';

const StepFour = () => {
    const { state } = useLocation();
    let navigate = useNavigate();
    const [email, setEmail] = useState();
    const [error, setError] = useState(null);


    useEffect(() => {

        if (state === null || state.mobile_number === "" || state.mobile_number === null || state.mobile_number === undefined
            || state.otp === "" || state.otp === null || state.otp === undefined || state.name === null || state.name === undefined || state.name === "") {
            window.history.replaceState({}, "");
            navigate('/signup/step-one');
            return;
        }
    }, []);


    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            toast.error("Please enter valid email address");
            toast.error(error);
            return;
        }


        await PreLoginPostApi("signup/is-valid-email", JSON.stringify({ "email": email })).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    window.localStorage.setItem("email", email);
                    return navigate('/signup/step-five', {
                        state: {
                            mobile_number: state.mobile_number,
                            otp: state.otp,
                            name: state.name,
                            email: email,
                        }
                    });
                }

                toast.error(responseData["messages"].toString());
                return;
            }

            toast.error("A problem occur with your email address. Please try again.");
            return;
        });



    };

    const goBack = () => {
        navigate('/signup/step-three', {
            state: {
                mobileNumber: state.mobile_number,
                otpNumber: state.otp,
            }
        });
    }
    return (
        <div className="w-3/5">
            <ToastContainer />
            <h1 className="font-bold text-4xl mb-8">Your Email Here</h1>
            <div className="bg-neutral-100 p-9 text-secondary">
                <p className="mb-5">Provide the email you want to associate with your merchant account. We will send a link there for verification</p>
                <form onSubmit={onSubmit} >
                    <div className="mb-4">
                        <input type="email" name="email" value={email || ""} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-lg border border-[#EEEEEE]" autoComplete='off' placeholder="Business Email" required />
                    </div>
                    <Button />
                    <p onClick={goBack} className="cursor-pointer"><span className="font-bold text-primary"><ImArrowRight2 className='inline ml-1 mb-0.5 rotate-180' /> Change Merchant Account Name?</span> </p>
                </form>
            </div>
        </div>
    );
};

export default StepFour;