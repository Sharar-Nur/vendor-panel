
import React, { Suspense, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as CloseBtn } from '../../../../assets/icons/close.svg'
import Button from '../../../../components/Button';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PostLoginPostApi from './../../../../components/api/PostLoginPostApi';
import RootContext from "./../../../../components/context/RootContext";
import { useContext } from 'react';


var BlackButton = React.lazy(()=>{ return import("../../../../components/BlackButton"); });


const BankTransferStepTwo = () => {

    const RootContextValue = useContext(RootContext);

    const navigate = useNavigate();
    const location = useLocation();

    const [input, setInput] = useState("");

    useEffect(()=>{
        if(location === null || location.state === null || location.state.input_amount === null || location.state.amount === null || location.state.charge === null || location.state.total_payable === null || location.state.account_no === null || location.state.account_name === null || location.state.bank_id === null || location.state.bank_image === null || location.state.bank_name === null || location.state.input_amount === "" || location.state.amount==="" || location.state.charge === "" || location.state.total_payable === "" || location.state.account_no === "" || location.state.account_name === "" || location.state.bank_branch === null || location.state.bank_id === "" || location.state.bank_image === "" || location.state.bank_name === "" || location.state.bank_branch === "" ) {
            navigate("/dashboard/transfer", {
                state:{
                    errorMessage: "No Transfer information Found."
                }
            });
            return;
        }
    },[]);


    var handleChange = (e) => {
        const re = /^[0-9]*$/;

        if( e.value === '' || re.test(e.value) ) {
            setInput(e.value);
        }
    }

    var navigateBack = () => {
        navigate("/dashboard/transfer");
    }

    var submitForm = (event) => {
        event.preventDefault();

        const reqBody = {
            beneficiary_id: location?.state?.bank_id,
            amount: location?.state?.input_amount,
            pin: input
        };

        try {
            PostLoginPostApi("transaction/withdraw-money-bank-request/execute", JSON.stringify(reqBody)).then((responseJSON) => {
                var response = JSON.stringify(responseJSON);
                response = JSON.parse(response);
                
                if (response["status"] === 1) {
                    
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);
                    
                    if(responseData["code"] === 200 ) {

                        // Update Via Root Context
                        RootContextValue.forceUpdate('balances');

                        toast.success("Bank Transfer Successfully.");
                        return navigate("/dashboard/transfer");
                    }

                    toast.error(responseData["messages"].toString());
                }

            }).catch((err)=>{
                console.log(err);
                toast.error("A problem occur. Please try again.");
            });
        }
        catch(exception) { 
            toast.error("A problem occur. Please try again.");
            console.log(exception);
        }
        finally {
            return;
        }
    }


    return (
        <div className='h-[100vh]'>
            
            <header className="p-4 border-b-2 border-dark-white mb-[40px]">
                <Link to="/dashboard/transfer"><CloseBtn className="float-left" /></Link>
                <p className="text-center">Bank Transfer</p>
            </header>

            <main className="max-w-2xl m-auto">

                <p className="text-ash mb-2 mt-3">Transfer Information </p>
                
                <div className="flex items-center justify-between border border-solid border-neutral-100 p-5 rounded" style={{ boxShadow: "0px 4px 40px rgba(0,0,0,0.05)" }}>
                    <div className="flex items-center">
                        <img src={location?.state?.bank_image} alt={location?.state?.bank_name} className="max-w-[80px] max-h-[80px]" />
                        <div className="ml-5">
                            <h4 className="text-xl">{location?.state?.bank_name}</h4>
                            <p>{location?.state?.bank_branch}</p>
                        </div>
                    </div>
                </div>

                <div className="my-3 flow-root px-2 pb-0 rounded bg-white" style={{ boxShadow: "0px 4px 40px rgba(0,0,0,0.05)" }}>
                    <div className="block text-secondary" style={{fontSize: "16px"}}>
                        <div className='flex py-1 px-3'>
                            <p className="float-left w-1/3">Account Name</p>
                            <p className="text-right w-2/3 italic">{location?.state?.account_name}</p>
                        </div>
                        <div className='flex py-1 px-3 ' style={{borderTop: "2px dotted #F5F5F5"}}>
                            <p className="float-left w-1/3">Account No.</p>
                            <p className="text-right w-2/3 italic">{location?.state?.account_no}</p>
                        </div>
                    </div>
                </div>

                <div className="my-3 flow-root px-2 pb-0 rounded bg-white" style={{ boxShadow: "0px 4px 40px rgba(0,0,0,0.05)" }}>
                    <div className="block text-secondary" style={{fontSize: "16px"}}>
                        <div className='flex py-1 px-3'>
                            <p className="float-left w-1/3">Transfer Amount</p>
                            <p className="text-right w-2/3">{location?.state?.amount}</p>
                        </div>
                        <div className='flex py-1 px-3 ' style={{borderTop: "2px dotted #F5F5F5"}}>
                            <p className="float-left w-1/3">Charge</p>
                            <p className="text-right w-2/3">{location?.state?.charge}</p>
                        </div>
                        <div className='flex py-1 px-3 ' style={{borderTop: "2px dotted #F5F5F5"}}>
                            <p className="float-left w-1/3">Total Payable</p>
                            <p className="text-right w-2/3 font-bold">{location?.state?.total_payable}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submitForm} action="" method="POST" className="form-body bg-white">
                    <div className="relative mt-4 mb-4 bg-white px-2 rounded-md border border-black-300">
                        <input type="password" id="pin" name="pin" autoComplete='off' maxLength={4} minLength={4} className="block pl-0.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " value={input} onChange={(e)=>handleChange(e.target)} required />

                        <label htmlFor="pin" className="absolute text-base pt-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-2.5 peer-focus:text-[#34A853] peer-focus:dark:text-[#34A853] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 ">Enter Your PIN</label>
                    </div>

                    <Suspense>
                        <Button name="Submit"></Button>
                        <BlackButton name="Cancel" onClick={navigateBack}></BlackButton>
                    </Suspense>
                </form>

                
            </main>
        </div>
    );
};

export default BankTransferStepTwo;