import React, { useEffect, useState } from "react";
import { ReactComponent as CloseBtn } from './../../../assets/icons/close.svg';
import { Link, useNavigate } from 'react-router-dom';
import $ from "jquery";
import { toast } from 'react-toastify';

import preLoginGetApi from "../../../components/api/PreLoginGetApi";
import Button from "../../../components/Button";
import InputMask from "react-input-mask";
import PostLoginPostApi from "../../../components/api/PostLoginPostApi";

import ShowPasswordOpen from "./../../../assets/icons/show-password-icon-open.png";
import ShowPasswordClose from "./../../../assets/icons/show-password-icon-close.png";



const CreateOfflineStore = () => {

    const navigate = useNavigate();

    const [category, setCategory] = useState([]);
    const [input, setInput] = useState({
        counterName: "",
        mobileNumber: "",
        emailAddress: "",
        loginPassword: "",
        storeCategory: "",
        location: ""
    });

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    const submitFormData = (event) => {
        event.preventDefault();

        if (input.counterName.length === 0 || input.emailAddress.length === 0 || input.loginPassword.length === 0 || input.location.length === 0 || input.mobileNumber.length === 0) {
            toast.error("Please enter all the fields");
            return;
        }

        if (!isValidEmail(input.emailAddress)) {
            toast.error("Please enter valid email address");
            return;
        }

        // if(isNaN(input.storeCategory)) {
        //     toast.error("Please choose valid shop category.");
        //     return;
        // }

        let mobileNumberFinal = input.mobileNumber.split(" ").join("");
        mobileNumberFinal = mobileNumberFinal.replace("_", "");
        if (mobileNumberFinal.length !== 14) {
            toast.error("Please enter valid mobile number.");
            return;
        }

        if ((input.loginPassword.length < 8) || (input.loginPassword.length > 32)) {
            toast.error("Password must contain 8 - 32 characters.");
            return;
        }
        // if (mobileNumberFinal.indexOf("1") !== 4) {
        //     toast.error("Phone number must start with +8801*******");
        //     return
        // }

        let requestArr = {
            shop_type_id: 2,
            category_id: input.storeCategory,
            address: input.location,
            counter_name: input.counterName,
            mobile_no: mobileNumberFinal,
            password: input.loginPassword,
            store_id: input.emailAddress
        };


        PostLoginPostApi("user/store/physical-shop/create", JSON.stringify(requestArr)).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    toast.success("Counter added successfully.");
                    return navigate("/dashboard/counter/", {
                        state: {
                            tab: "view-offline-store"
                        }
                    });
                }

                toast.error(responseData["messages"].toString());
            }
        }).catch((error) => {
            toast.error("A problem occur. Please try again.");
            console.log(error);
        });

        return;
    }

    const handleInputChange = (e) => {
        setInput({ ...input, [e.name]: e.value });
    }

    useEffect(() => {
        preLoginGetApi("api/v1/business/categories").then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    setCategory(responseData["data"]["categories"]);
                }
            }
        }).catch((error) => {
            console.log(error)
        });
    }, []);


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
        <div className="font-medium min-h-[100vh] w-[100%] h-[100%] custom-container-left custom-scroll-auto">
            <div className="font-medium pb-[60px]">
                <header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[60px]">
                    <Link to="/dashboard/counter" state={{ tab: "view-offline-store" }}><CloseBtn /></Link>
                    <p className="text-xl text-black ">Add New Offline Counter</p>
                    <div></div>
                </header>
                <main className="max-w-3xl m-auto">
                    <div className="flex justify-center ">
                        <form action='' autoComplete="off" method='POST' className="w-full" onSubmit={(event) => submitFormData(event)} >

                            <h3 className="text-xl mb-[15px]">Add New Offline Counter</h3>

                            <div className="relative py-2 mb-1">
                                <input type="text" name="counterName" id="counterName" value={input.counterName} onChange={(e) => handleInputChange(e.target)} title="Counter Name" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />

                                <label htmlFor="counterName" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Counter Name</label>
                            </div>

                            <div className="relative py-2">
                                <InputMask type="text" mask="+880 999 999 9999" name="mobileNumber" id="mobileNumber" value={input.mobileNumber} onChange={(e) => handleInputChange(e.target)} title="Mobile Number" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />

                                <label htmlFor="mobileNumber" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Mobile Number</label>
                            </div>


                            <div className="relative py-2">
                                <input type="email" name="emailAddress" id="emailAddress" value={input.emailAddress} onChange={(e) => handleInputChange(e.target)} title="Email Address" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />

                                <label htmlFor="emailAddress" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Email Address</label>
                            </div>

                            {/* <div className="py-2 mt-1 relative">
								<select name="storeCategory" id="storeCategory" defaultValue={input.storeCategory} onChange={(e) => handleInputChange(e.target)} className="w-full rounded border-solid border border-dark-white" required>
                                    <option value="" disabled>Choose Shop Category</option>
                                    {(category.length > 0) && category.map((val,index)=>
                                        <option key={index} value={val?.id} className="text-black">{val?.name}</option>
                                    )}
								</select>
                                
                                <label htmlFor="storeCategory" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:opacity-100 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Shop Category</label>
							</div> */}

                            <div className="relative py-2 mb-1">
                                <input type="text" name="location" id="location" value={input.location} onChange={(e) => handleInputChange(e.target)} title="Location" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />

                                <label htmlFor="location" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Location</label>
                            </div>

                            <div className="relative py-1 mb-4">
                                <input type="password" minLength={8} maxLength={32} autoComplete="new-password" name="loginPassword" id="loginPassword" value={input.loginPassword} onChange={(e) => handleInputChange(e.target)} title="Password" placeholder=" " className="block w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />

                                <label htmlFor="loginPassword" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Password</label>


                                <img alt="Show Password" className="show-password-icon" src={ShowPasswordOpen} onClick={() => showPassword("loginPassword")} style={{ paddingTop: "7px", paddingRight: "5px" }}></img>
                                <img alt="Show Password" style={{ display: "none", marginTop: "-29px", marginRight: "12px" }} className="show-password-icon" src={ShowPasswordClose} onClick={() => showPassword("loginPassword")}></img>
                            </div>

                            <Button name="Add Counter"></Button>
                            {/* <button type="submit" className="text-white bg-primary px-10 py-2 mb-3 mt-5 rounded cursor-pointer hover:bg-brand-dark">Submit</button> */}
                        </form>
                    </div>
                </main>
            </div>

            <style>{`
				* :disabled {
					background-color: #F5F5F5 !important;
				}

			`}</style>

        </div>

    );
};

export default CreateOfflineStore;