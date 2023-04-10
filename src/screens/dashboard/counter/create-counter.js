import React, {useState, useRef, useEffect} from "react";
import { ReactComponent as CloseBtn } from './../../../assets/icons/close.svg';
import { Link, useNavigate } from 'react-router-dom';
import $ from "jquery";
import { toast } from 'react-toastify';


import Button from "../../../components/Button";
import PostLoginPostApi from "../../../components/api/PostLoginPostApi";
import PreLoginGetApi from "../../../components/api/PreLoginGetApi";

import ShowPasswordOpen from "./../../../assets/icons/show-password-icon-open.png";
import ShowPasswordClose from "./../../../assets/icons/show-password-icon-close.png";



const CreateStore = (props) => {

    const navigate = useNavigate();


    const fileInput = useRef();
    const fileInput2 = useRef();

    const [file, setFile] = useState();
    const [file2, setFile2] = useState();

    const selectFile = () => {
        fileInput.current.click();
    }

    const selectFile2 = () => {
        fileInput2.current.click();
    }

    const handleChange = (e) => {
        console.log(e.target.files[0]);
        if( !e.target.files[0]["type"].includes("image/") && e.target.files[0]["type"] !== "application/pdf" ) {
            toast.error("Please upload valid PDF or Image file.");
            return;
        }

        setFile(e.target.files[0]);
    }

    const handleChange2 = (e) => {
        if(!e.target.files[0]["type"].includes("image/") ) {
            toast.error("Please upload valid Image file.");
            return;
        }
        
        setFile2(e.target.files[0]);
    }

    
    const [input, setInput] = useState({
        storeCategory: "",
        location: "",
        storeURL: "",
        successURL: "",
        cancelURL: "",
        ipnURL: "",
        loginPassword: ""
    });


    const [category, setCategory] = useState([]);
    useEffect(() => {
        PreLoginGetApi("api/v1/business/categories").then((responseJSON)=>{
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

    const submitFormData = (event) => {
        event.preventDefault();
        
        if(input.storeURL.length === 0 || input.successURL.length === 0 || input.cancelURL.length === 0 || input.ipnURL.length === 0 || input.loginPassword.length === 0 || input.location.length === 0 ) {
            toast.error("Please enter all the fields");
            return;
        }

        if( (input.loginPassword.length < 8 ) || (input.loginPassword.length > 32) ) {
            toast.error("Password must contain 8 - 32 characters.");
            return;
        }

        if(file === undefined || file2 === undefined) {
            toast.error("Please upload Trade License and Logo !");
            return;
        }

        // if(isNaN(input.storeCategory)) {
        //     toast.error("Please choose valid shop category.");
        //     return;
        // }
        

        let requestBody = new FormData();
        requestBody.append("shop_type_id", 1);
        requestBody.append("category_id", input.storeCategory);
        requestBody.append("trade_license", file);
        requestBody.append("store_logo", file2);
        requestBody.append("address", input.location);
        requestBody.append("store_url", input.storeURL);
        requestBody.append("success_url", input.successURL);
        requestBody.append("cancel_url", input.cancelURL);
        requestBody.append("ipn_url", input.ipnURL);
        requestBody.append("store_password", input.loginPassword);
        requestBody.append("mobile_no", "");

        PostLoginPostApi("user/store/store-configuration", requestBody, 1, 1).then((responseJSON)=>{
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if(response["status"]===1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if(responseData["code"]===200) {
                    toast.success("Counter added successfully.");
                    return navigate("/dashboard/counter/");
                }

                toast.error(responseData["messages"].toString());
            }
        }).catch((error)=>{
            toast.error("A problem occur. Please try again.");
            console.log(error);
        }).finally(()=>{
            return;
        });
    }

    const handleInputChange = (e) => {
        setInput({ ...input, [e.name]: e.value });
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
		<div className="font-medium min-h-[100vh] w-[100%] h-[100%] custom-container-left custom-scroll-auto">
			<div className="font-medium pb-[60px]">
				<header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[60px]">
					<Link to="/dashboard/counter"><CloseBtn /></Link>
					<p className="text-xl text-black ">Add Online Counter</p>
					<div></div>
				</header>
				<main className="max-w-3xl m-auto">
					<div className="flex justify-center ">
						<form action='' autoComplete="off" method='POST' className="w-full" onSubmit={(event)=>submitFormData(event)} >
            
                            <h3 className="text-xl mb-[15px]">Add Counter</h3>

                            
                            <div className="flex pb-2 pt-1 mb-1 items-center">
                                <div className="flex items-center relative w-[49.5%] bg-[#f5f5f5] p-2 rounded-md" style={{border: "1px solid #e0e0e0"}}>
                                    <input type="file" name="tradeLicense" className="hidden" ref={fileInput} onChange={handleChange} />
                                    <label htmlFor="Trade License" className="p-1 text-base font-medium">Trade License</label>

                                    {file ? 
                                    <>
                                        {file["type"].includes("image/") ? <img src={URL.createObjectURL(file)} alt="Preview Trade License" className="max-h-10 max-w-10 ml-auto order-3" /> : <span className="text-xs pr-3">{file["name"]}</span> }
                                        <button type="button" className="text-white ml-auto order-3 bg-[#444] py-[10px] px-[10px] rounded-[3px] cursor-pointer block justify- text-xs" onClick={selectFile}>Change Trade License</button>
                                    </> : 
                                    <>
                                        <button type="button" className="text-white ml-auto order-2 bg-[#1A202C] py-[10px] px-[25px] rounded-[3px] cursor-pointer block justify- text-base" onClick={selectFile}>Upload Trade License</button>
                                    </>}
                                </div>

                                <div className="flex items-center relative w-[49.5%] bg-[#f5f5f5] p-2 rounded-md ml-auto order-2" style={{border: "1px solid #e0e0e0"}}>
                                    <input type="file" className="hidden" name="logo"  ref={fileInput2} onChange={handleChange2} />
                                    <label htmlFor="Trade License" className="p-1 text-base font-medium">Logo</label>
                                    {file2 ? 
                                        <>
                                            <img src={URL.createObjectURL(file2)} alt="Preview Logo" className="max-h-10 max-w-10 ml-auto order-3" />
                                            <button type="button" className="text-white ml-auto order-3 bg-[#444] py-[10px] px-[50px] rounded-[3px] cursor-pointer block justify- text-xs" onClick={selectFile2}>Change Logo</button>
                                        </> : 
                                        <>
                                            <button type="button" className="text-white flex ml-auto order-2 bg-[#1A202C] py-[10px] px-[70px] rounded-[3px] cursor-pointer justify- text-base" onClick={selectFile2}>Upload Logo</button>
                                        </>
                                    }
                                    
                                </div>
                            </div>

                            
                            <div className="relative py-2 mb-1">
								<input type="text" name="location" id="location" value={input.location} onChange={(e) => handleInputChange(e.target)} title="Location" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />
                                
                                <label htmlFor="location" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Location</label>
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

							<div className="relative pb-2 pt-1 mb-1">
								<input type="url" name="storeURL" id="storeURL" value={input.storeURL}  onChange={(e) => handleInputChange(e.target)} title="e.g. http://example.com" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />
                                
                                <label htmlFor="storeURL" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Counter URL </label>
							</div>

                            <div className="relative pb-2 pt-1 mb-1">
								<input type="url" name="successURL" id="successURL" value={input.successURL}  onChange={(e) => handleInputChange(e.target)} title="e.g. http://example.com" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />
                                
                                <label htmlFor="successURL" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Success URL</label>
							</div>

                            <div className="relative pb-2 pt-1 mb-1">
								<input type="url" name="cancelURL" id="cancelURL" value={input.cancelURL}  onChange={(e) => handleInputChange(e.target)} title="e.g. http://example.com" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />
                                
                                <label htmlFor="cancelURL" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Cancel URL</label>
							</div>

                            <div className="relative pb-2 pt-1 mb-1">
								<input type="url" name="ipnURL" id="ipnURL" value={input.ipnURL}  onChange={(e) => handleInputChange(e.target)} title="e.g. http://example.com" placeholder=" " className="w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />
                                
                                <label htmlFor="ipnURL" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">IPN URL</label>
							</div>
                        
                            <div className="relative py-1 mb-4">
                                    <input type="password" minLength={8} maxLength={32} autoComplete="new-password" name="loginPassword" id="loginPassword" value={input.loginPassword} onChange={(e) => handleInputChange(e.target)} title="Password" placeholder=" " className="block w-full rounded border-solid border border-dark-white placeholder:text-ash appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" required />
                                    
                                    <label htmlFor="loginPassword" className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Password</label>

                                    
                                    <img alt="Show Password" className="show-password-icon" src={ShowPasswordOpen} onClick={()=>showPassword("loginPassword")} style={{paddingTop: "7px", paddingRight: "5px"}}></img>
                                    <img alt="Show Password" style={{display: "none", marginTop: "-29px", marginRight: "12px"}} className="show-password-icon" src={ShowPasswordClose} onClick={()=>showPassword("loginPassword")}></img>
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

export default CreateStore;