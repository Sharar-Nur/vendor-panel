import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Button from '../../../components/Button';
import { Link, useNavigate } from "react-router-dom";
import { ImArrowRight2 } from "react-icons/im";
import SignUpOrLogin from '../../../components/SignUpOrLogin';
import InputMask from "react-input-mask";
import PreLoginApi from '../../../components/api/PreLoginApi';

const StepOne = () => {
    // const { register, handleSubmit, watch } = useForm();
    let navigate = useNavigate();
    const [businessNumber, setBusinessNumber] = useState();
    const [apiData, setApiData] = useState('');
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);


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
                let mobileNumber = businessNumber;
                const numberWithoutSpace = mobileNumber.split(" ").join("");
                window.localStorage.setItem("businessNumber", numberWithoutSpace);
                navigate("/signup/step-two", {
                    state: {
                        mobileNumber: numberWithoutSpace
                    }
                });

                return;
            }
            toast.error(response["messages"].toString());
        }
    }, [apiData, isLoaded])

    const onSubmit = async (e) => {
        e.preventDefault();

        let temp = businessNumber; //not changing the state directly

        let mobileNumber = temp.split(" ").join("");

        if (mobileNumber.length !== 14) {
            toast.error("Please enter valid phone number.");
            return;
        }


        // if (mobileNumber.indexOf("1") !== 4) {
        //     toast.error("Phone number must starts with +8801*******");
        //     return
        // }

        try {

            var req_body = JSON.stringify({ mobile_number: mobileNumber });
            PreLoginApi("signup/existence", req_body).then((responseJSON) => {

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
            toast.error(err.toString());

        }


    };
    return (
        <div className="w-3/5">
            <ToastContainer />
            <h1 className="font-bold text-4xl mb-8">Join Deshi</h1>
            <SignUpOrLogin />
            <div className="bg-neutral-100 p-9 text-secondary">
                <p className="mb-5">Provide the 11-digit Bangladeshi phone number you want to associate with your merchant account.</p>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">

                        <div className="relative mb-4 bg-white px-2 rounded-md">
                            <InputMask type="text" mask="+880 999 999 9999" id="businessNumber" name="businessNumber" value={businessNumber || ""} autoComplete='off' onChange={(e) => setBusinessNumber(e.target.value)} className="block pl-0.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " required />
                            <label htmlFor="businessNumber" className="absolute text-base pt-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-2.5 peer-focus:text-[#34A853] peer-focus:dark:text-[#34A853] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 ">Mobile Number</label>
                        </div>
                    </div>
                    <Button />
                    <p>Already have an account? <Link to="/login" className="font-bold text-primary">Log In Instead <ImArrowRight2 className='inline ml-1 mb-0.5' /></Link> </p>
                </form>
            </div>
        </div>
    );
};

export default StepOne;