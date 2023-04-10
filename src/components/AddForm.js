import React, { useState, useEffect } from 'react';
import Button from './Button';
import SignUpOrLogin from './SignUpOrLogin';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ImArrowRight2 } from "react-icons/im";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputMask from "react-input-mask";

const AddForm = ({ title, subtitle, placeholder, type, name, value }) => {
    const [inputValue, setInputValue] = useState("");
    const [data, setData] = useState('');
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    let navigate = useNavigate();
    const location = useLocation();


    async function fetchData(param) {
        await fetch(process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_PREFIX + "signup/existence", {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),

            body: JSON.stringify({
                mobile_number: param,
            })
        }).then(res => res.json()).then(
            (result) => {
                setIsLoaded(true);
                setData(result);
                setInputValue(param)
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    useEffect(() => {
        window.history.replaceState({}, "");
        if (isLoaded === true) {
            if (error) {
                toast.error(error.messages.toString());
                return;
            }

            let response = JSON.stringify(data);
            response = JSON.parse(response);

            if (response["code"] === 200) {
                navigate("/signup-step-three", {
                    state: {
                        mobileNumber: inputValue
                    }
                });
                return;
            }

            toast.error(response["messages"].toString());
        }

    }, [data]);


    const onSubmit = (e) => {
        e.preventDefault();

        var mobileNumber = inputValue.split(" ").join("");
        mobileNumber = mobileNumber.replace(/_+/g, '');

        if (mobileNumber.length !== 14) {
            toast.error("Please enter valid phone number.");
            return;
        }

        fetchData(mobileNumber);

        // if (name === "mobileNumber" && /^\d{11}$/.test(inputValue)) {
        //     setInputValue("")
        //     navigate('/otp');
        // }
        // else {
        //     toast.error("Invalid number; must be 11 digits");
        // }

        // if (name === "email" && (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/).test(inputValue)) {
        //     setInputValue("")
        //     navigate('/terms-and-policy');
        // }
        // else {
        //     toast.error("Invalid email");
        // }
    }

    return (
        <div className="w-3/5">
            <ToastContainer />
            <h1 className="font-bold text-4xl mb-8">{title}</h1>
            {location.pathname === "/signup-step-one" && <SignUpOrLogin />}
            <div className="bg-neutral-100 p-9 text-secondary">
                <p className="mb-5">{subtitle}</p>
                <form onSubmit={onSubmit} >
                    <div className="mb-4">
                        {location.pathname === "/signup-step-two"
                            ? <InputMask mask="+880 999 999 9999" value={inputValue} type={type} name={name} onChange={(e) => setInputValue(e.target.value)} className="w-full p-3 rounded-lg border border-[#EEEEEE]" minLength={16} autoComplete='off' placeholder={placeholder} required />
                            : <input type={type} name={name} className="w-full p-3 rounded-lg border border-[#EEEEEE]" autoComplete='off' placeholder={placeholder} value={inputValue} onChange={(e) => { setInputValue(e.target.value) }} />
                        }
                        {/* <input type={type} name={name} className="w-full p-3 rounded-lg border border-[#EEEEEE]" autoComplete='off' placeholder={placeholder} value={inputValue} onChange={(e) => { setInputValue(e.target.value) }} /> */}
                        {/* <label htmlFor="floatingInput">Mobile number</label> */}
                    </div>
                    <Button value={value} />
                    {location.pathname === "/signup-step-one" && <p>Already have an account? <Link to="/login" className="font-bold text-primary">Login Instead <ImArrowRight2 className='inline ml-1 mb-0.5' /></Link> </p>}
                    {/* {location.pathname === "/forget-password-step-one" && <p>Don’t have any account? <Link to="/signup" className="font-bold text-primary">Signup Instead <ImArrowRight2 className='inline' /></Link> </p>} */}
                </form>
            </div>
        </div>
    );
};

export default AddForm;  