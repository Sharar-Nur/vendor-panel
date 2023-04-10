
import React, { Suspense, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as CloseBtn } from '../../../../assets/icons/close.svg'
import Button from '../../../../components/Button';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PostLoginPostApi from '../../../../components/api/PostLoginPostApi';

var BlackButton = React.lazy(()=>{ return import("../../../../components/BlackButton"); });


const RefundStepOne = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [input, setInput] = useState("");

    const [transactionData, setTransactionData] = useState([]);
    useEffect(()=>{
        if(location === null || location.state === null || location.state.transaction === null) {
            navigate("/dashboard/transactions", {
                state:{
                    errorMessage: "No Transaction Details Found."
                }
            });
            return;
        }

        setTransactionData(location.state.transaction);
    },[location]);


    var navigateBack = () => {
        navigate("/dashboard/transaction-details", {
            state: {
                transaction: transactionData
            }
        });
        return;
    }

    
    var handleChange = (e) => {

        const re = /^[0-9]*(\.[0-9]{0,2})?$/;

        if( e.value === '' || re.test(e.value) ) {
            const maxAmount = transactionData["amount"].toString().replace(",","");

            if(e.value === "") {
                setInput(e.value); 
                return;
            }

        
            if( Number(maxAmount) >= Number(e.value)) {
                setInput(e.value);
            }

        }
    }

    var submitForm = (event) => {
        event.preventDefault();

        if(input === null || input.length === 0 ) {
            toast.error("Please enter amount.");
            return;
        }
        
        const reqBody = {};
        reqBody.receiver_mobile_number = (transactionData["source"])?transactionData["source"]["mobile_no"]:transactionData["destination"]["mobile_no"];
        reqBody.invoice_id = transactionData["transaction_id"];
        reqBody.amount = input;

        try {
            PostLoginPostApi("transaction/refund-payment/summary", JSON.stringify(reqBody)).then((responseJSON) => {
                var response = JSON.stringify(responseJSON);
                response = JSON.parse(response);
                
                if (response["status"] === 1) {
                    
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);
                    
                    if(responseData["code"] === 200 ) {
                        navigate("/dashboard/transaction/refund-step-two", {
                            state: {
                                transaction: transactionData,
                                req_amount: input,
                                mobile_number: responseData["data"]["summary"]["recipient"]["mobile_number"],
                                amount: responseData["data"]["summary"]["amount"],
                                charge: responseData["data"]["summary"]["charge"],
                                total_amount: responseData["data"]["summary"]["total_payable"]
                            }
                        });
                        return;
                    }

                    toast.error(responseData["messages"].toString());
                }

            }).catch((err)=>{
                toast.error("A problem occur. Please try agin.");
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
                <Link to="/dashboard/transactions"><CloseBtn className="float-left" /></Link>
                <p className="text-center">Refund</p>
            </header>

            <main className="max-w-2xl m-auto">
                {/*                 
                <div className="p-5 bg-neutral-100 rounded mb-[30px]">
                    <p>Enter the phone number you want to Connect. We’ll check if there’s any Deshi Account associated with it. </p>
                </div>

                <div className="p-5 bg-[#FDEFF4] rounded mb-[30px]">
                    <p>Sorry! You can’t add 01711960120 as a connect as there’s No Deshi User associated with it. Try a New number instead? </p>
                </div> 
                */}


                {(transactionData.length===0)?(
                    <p className='text-center text-lg font-semibold'>Please wait....</p>
                ):(
                    <>
                        <h1 className="text-2xl font-semibold text-center" style={{textTransform: "uppercase"}}>{transactionData["transaction_type"]}</h1>
                        <p className='text-lg text-[#8B8F97] text-center py-1 pb-3'>Transaction ID : {transactionData["transaction_id"]}</p>
                        
                        <h1 className="text-3xl font-semibold text-center" style={{color: transactionData["new"]["amount_color_code"]}}>{transactionData["amount"]} {transactionData["currency"]}</h1>
                        <p className="text-ash mb-2 mt-3">
                            Receiver Account
                        </p>
                        
                        <div className="flex items-center justify-between border border-solid border-neutral-100 p-5 rounded" style={{ boxShadow: "0px 4px 40px rgba(0,0,0,0.05)" }}>
                            <div className="flex items-center ">
                                <img src={transactionData["new"]["photo"]} alt={transactionData["new"]["title"]} className="w-[80px] h-[80px] rounded-[50%]" />
                                <div className="ml-5">
                                    <h4 className="text-xl mb-2.5">{transactionData["new"]["title"]}</h4>
                                    <p>{(transactionData["source"])?transactionData["source"]["mobile_no"]:transactionData["destination"]["mobile_no"]}</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submitForm} action="" method="POST" className="form-body">
                            <div className="relative mt-4 mb-4 bg-white px-2 rounded-md border border-black-300">
                                <input type="text" id="refund_amount" name="refund_amount" autoComplete='off' className="block pl-0.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" placeholder=" " value={input} onChange={(e)=>handleChange(e.target)} required />

                                <label htmlFor="refund_amount" className="absolute text-base pt-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-2.5 peer-focus:text-[#34A853] peer-focus:dark:text-[#34A853] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 ">Refund Amount</label>
                            </div>

                            <Suspense>
                                <Button name="Submit"></Button>
                                <BlackButton name="Cancel" onClick={navigateBack}></BlackButton>
                            </Suspense>
                        </form>
                    </>
                )}

                
            </main>
        </div>
    );
};

export default RefundStepOne;