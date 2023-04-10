import React, {useEffect, useState} from "react";
import { ReactComponent as CloseBtn } from './../../../assets/icons/close.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import preLoginGetApi from "../../../components/api/PreLoginGetApi";
import Button from "../../../components/Button";
import InputMask from "react-input-mask";
import PostLoginPostApi from "../../../components/api/PostLoginPostApi";




const EditOfflineStore = () => {

    const navigate = useNavigate();
    const { state } = useLocation();

    const [category, setCategory] = useState([]);
    const [input, setInput] = useState({
        counterName: "",
        mobileNumber: "",
        emailAddress: "",
        storeCategory: "",
        location: ""
    });


    useEffect(() => {
        if (state === null || state?.data === undefined || state?.data === "" || state?.data === null ) {
            toast.error("No valid Counter Id found.");
            return navigate(-1);
        }

        setInput({...input, 
            id: state?.data?.id,
            counterName: state?.data?.counter_name,
            mobileNumber: state?.data?.mobile_no,
            emailAddress: state?.data?.store_id,
            storeCategory: state?.data?.store_category?.id,
            location: (state?.data?.address!==null?state?.data?.address:"")
        });

    }, [state, navigate]);


    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    const submitFormData = (event) => {
        event.preventDefault();
        
        if(input.counterName.length === 0 || input.emailAddress.length === 0 || input.location.length === 0 || input.mobileNumber.length === 0 ) {
            toast.error("Please enter all the fields");
            return;
        }

        if(!isValidEmail(input.emailAddress)){
            toast.error("Please enter valid email address");
            return;
        }

        // if(isNaN(input.storeCategory)) {
        //     toast.error("Please choose valid shop category.");
        //     return;
        // }

        let mobileNumberFinal = input.mobileNumber.split(" ").join("");
        mobileNumberFinal = mobileNumberFinal.replace("_","");

        let requestArr = {
            store_configuration_id: input.id,
            shop_type_id: 2,
            category_id: input.storeCategory,
            address: input.location,
            counter_name: input.counterName,
            mobile_no: mobileNumberFinal,
            password: input.loginPassword,
            store_id: input.emailAddress
        };

        PostLoginPostApi("user/store/physical-shop/update",JSON.stringify(requestArr)).then((responseJSON)=>{
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if(response["status"]===1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if(responseData["code"]===200) {
                    toast.success("Store update successfully.");
                    return navigate("/dashboard/counter/", {state: {
                        tab: "view-offline-store"
                    }});
                }

                toast.error(responseData["messages"].toString());
            }
        }).catch((error)=>{
            toast.error("A problem occur. Please try again.");
            console.log(error);
        });

        return;
    }

    const handleInputChange = (e) => {
        setInput({ ...input, [e.name]: e.value });
    }

    useEffect(() => {
        preLoginGetApi("api/v1/business/categories").then((responseJSON)=>{
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if(response["status"]===1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if(responseData["code"]===200) {
                    setCategory(responseData["data"]["categories"]);
                }
            }
        }).catch((error)=>{
            console.log(error)
        });
    }, []);
	

    const goBack = () => {
        return navigate(-1);
    }

	return (
		<div className="font-medium min-h-[100vh] w-[100%] h-[100%] custom-container-left custom-scroll-auto">
			<div className="font-medium pb-[60px]">
				<header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[60px]">
					{/* <Link to="/dashboard/counter" state={{tab: "view-offline-store"}}><CloseBtn /></Link> */}
					<span className="cursor-pointer" onClick={goBack}><CloseBtn /></span>
					<p className="text-xl text-black ">Edit Offline Store</p>
					<div></div>
				</header>
				<main className="max-w-3xl m-auto">
					<div className="flex justify-center ">
						<form action='' autoComplete="off" method='POST' className="w-full" onSubmit={(event)=>submitFormData(event)} >
            
                            <h3 className="text-xl mb-[15px]">Edit Offline Store</h3>

							<div className="relative py-2 mb-3">
								<input type="text" name="counterName" id="counterName" value={input.counterName}  onChange={(e) => handleInputChange(e.target)} title="Counter Name" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />
                                
                                <label htmlFor="counterName" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Counter Name</label>
							</div>

                            <div className="relative py-2 mb-3">
                                <InputMask type="text" mask="+880 999 999 9999" name="mobileNumber" id="mobileNumber" value={input.mobileNumber} onChange={(e) => handleInputChange(e.target)} title="Mobile Number" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />
                                
                                <label htmlFor="mobileNumber" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Mobile Number</label>
                            </div>


                            <div className="relative py-2 mb-3">
                                <input type="email" name="emailAddress" id="emailAddress" value={input.emailAddress} onChange={(e) => handleInputChange(e.target)} title="Email Address" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />
                                
                                <label htmlFor="emailAddress" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Email Address</label>
                            </div>
                            
							{/* <div className="py-2 mt-2 relative mb-3">
                                <select name="storeCategory" id="storeCategory" value={input.storeCategory} 
                                className="w-full rounded border-solid border border-dark-white" onChange={(e) => handleInputChange(e.target)} required>
                                    <option value="" disabled>Choose Shop Category</option>
                                    {(category.length > 0) && category.map((val,index)=>
                                        <option key={index} value={parseInt(val?.id)} className="text-black">{val?.name}</option>
                                    )}
								</select>
                                
                                <label htmlFor="storeCategory" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:opacity-100 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Shop Category</label>
							</div> */}

                            <div className="relative py-2 mb-3">
								<input type="text" name="location" id="location" value={input.location} onChange={(e) => handleInputChange(e.target)} title="Location" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />
                                
                                <label htmlFor="location" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Location</label>
							</div>
                        
                            <Button name="Update Store"></Button>
                            <Link to={"/dashboard/counter"} state={{tab: "view-offline-store"}} className="custom-btn block text-center">Back to list</Link>
                            
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

export default EditOfflineStore;