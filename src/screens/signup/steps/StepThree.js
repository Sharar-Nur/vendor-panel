import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Button from '../../../components/Button';
import { useNavigate, useLocation } from "react-router-dom";
import { ImArrowRight2 } from "react-icons/im";

const StepThree = () => {

    const { state } = useLocation();

    const [accountName, setAccountName] = useState();


    let navigate = useNavigate();

    useEffect(() => {
        //if the page access is valid or not
        if (state === null || state.mobileNumber === null || state.mobileNumber === undefined || state.mobileNumber === ""
            || state.otpNumber === null || state.otpNumber === undefined || state.otpNumber === ""
        ) {
            window.history.replaceState({}, "");
            navigate('/signup/step-one');
            return;
        }

    }, [])




    const onSubmit = (event) => {
        event.preventDefault();
        window.localStorage.setItem("name", accountName);

        navigate('/signup/step-four', {
            state: {
                mobile_number: state.mobileNumber,
                otp: state.otpNumber,
                name: accountName
            }
        })
    };

    const goBack = () => {
        window.history.replaceState({}, "");
        navigate('/signup/step-one');
        return;
    }
    return (
        <div className="w-3/5">
            <ToastContainer />
            <h1 className="font-bold text-4xl mb-8">Join Deshi</h1>
            <div className="bg-neutral-100 p-9 text-secondary">
                <p className="mb-5">Provide the business name as per trade license which you want to associate with your merchant account.</p>
                <form onSubmit={onSubmit} >
                    <div className="mb-4">
                        <input type="text" name="merchantAccountName" value={accountName || ""} onChange={(e) => setAccountName(e.target.value)} className="w-full p-3 rounded-lg border border-[#EEEEEE]" autoComplete='off' placeholder="Merchant Account Name" required />
                    </div>
                    <Button />

                    <p onClick={goBack} className="cursor-pointer"><span className="font-bold text-primary"><ImArrowRight2 className='inline ml-1 mb-0.5 rotate-180' /> Go Back?</span> </p>
                </form>
            </div>
        </div>
    );
};

export default StepThree;