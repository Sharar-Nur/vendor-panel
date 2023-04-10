
import React, { useContext, useState } from 'react';
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PostLoginPostApi from '../../../components/api/PostLoginPostApi';
import { toast } from 'react-toastify';
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';


const InstantTransfer = () => {
    
    const state = useLocation();
    const navigate = useNavigate();


    // Default Input Setup
    const [input, setInput] = useState({
        beneficiary_id: "",
        amount: ""
    });


    // Submit Form
    const submitFormData = (event) => {
        event.preventDefault();
        

        let availableAmount = currentBalance.replace(",","");
        availableAmount = availableAmount.replace("৳","");

        let amount = input.amount;
        if(amount < 500) {
            toast.error("Amount must be minimum 500.");
            return;
        }

        if(parseFloat(amount) > parseFloat(availableAmount)) {
            toast.error("Available balance must be grater than transfer amount.");
            return;
        }

        // API Call
        try {
            PostLoginPostApi("transaction/instant-money-transfer/summary",JSON.stringify(input)).then((responseJSON)=>{
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        return navigate("/dashboard/instant-transfer/transfer/confirm", {
                                state: {
                                    info: responseData["data"],
                                    input: input
                                }
                            }
                        );
                    }

                    toast.error(responseData["messages"].toString());
                    return;
                }

                toast.error("A problem occur. Please try again.");
                return;
            });
        }
        catch(ex) {
            toast.error("A problem occur while API call. Please try again.");
            console.log(ex.toString());
        }
    }

    const handleAmount = (val) => {
        if(isNaN(val) ) {
            return;
        }

        setInput({...input, amount: val});
    }
    
    const [bankInfo, setBankInfo] = useState({
        logo: "",
        name: "",
        code: "",
        branch: "",
        acc_no: "",
        acc_name: ""
    });


    const [currentBalance, setCurrentBalance] = useState("0.00");
    useEffect(()=>{
        if(state?.state?.bankInfo === null || state?.state?.bankInfo === undefined || state?.state?.bankInfo === "") {
            toast.error("No NPSB bank selected.");
            return navigate("/dashboard/instant-transfer/bank-lists");
        }

        let data = JSON.parse(state?.state?.bankInfo);

        setBankInfo({logo: data?.bank?.logo, name: data?.bank?.bank_name, code: data?.bank?.code, branch: data?.branch?.name, acc_no: data?.ac_no, acc_name: data?.name });
        setInput({...input, beneficiary_id: data?.id});

    },[navigate, state]);


    useEffect(()=>{
        PostLoginGetApi("user/balances").then((responseJSON) => {
            var response = JSON.stringify(responseJSON);
            response = JSON.parse(response);
            if (response["status"] === 1) {
                var responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);
                if (responseData["code"] === 200) {
                    let data = JSON.stringify(responseData["data"]);    
                    data = JSON.parse(data);    
                    
                    if( data["balances"][0]["is_active"] === 1 ) {
                        setCurrentBalance(data["balances"][0]["balance"]);
                    }
                }
            }
        });
    },[]);

    return (
        <div className="font-medium min-h-[100vh] w-[100%] h-[100%] custom-container-left custom-scroll-auto">
            
            <header className="p-4 border-b-2 border-dark-white ">
                <Link to="/dashboard/instant-transfer/bank-lists"><CloseBtn className="float-left" /></Link>
                <p className="text-center text-lg font-semibold">Instant Transfer</p>
            </header>

            <main className="max-w-5xl m-auto my-8">

                <form action='' method='POST' className="w-full" onSubmit={(event) => submitFormData(event)} >
                    
                    <div className="flex flex-col w-full pt-5">
                        <div className='overflow-x-auto pb-5 pt-0'>
                            <div className='min-w-full inline-block align-middle'>
                                <div className='border rounded-lg shadow overflow-hidden'>
                                    <table className='min-w-full divide-y divide-gray-200'>
                                        <thead className='bg-neutral-100'>
                                            <tr className='text-left '>
                                                <th scope="col" className="px-6 py-3 border-r-2">Bank Name</th>
                                                <th scope="col" className="px-6 py-3 border-r-2">Account Name</th>
                                                <th scope="col" className="px-6 py-3 border-r-2">Account Number</th>
                                                <th scope="col" className="px-6 py-3">Branch Name</th>
                                            </tr>
                                        </thead>

                                        <tbody className='divide-y divide-gray-200 '>
                                            <tr>
                                                <td className='px-6 py-4'>
                                                    <span className='flex'>
                                                        <div className='flex items-center mr-[5px]'>
                                                            <img src={bankInfo.logo} alt={bankInfo.code} className='max-w-[44px] max-h-[44px]' />
                                                            <p className='px-3'>{bankInfo.name}</p>
                                                        </div>
                                                    </span>
                                                </td>
                                                <td className='px-6 py-4'>{bankInfo.acc_name}</td>
                                                <td className='px-6 py-4'>{bankInfo.acc_no}</td>
                                                <td className='px-6 py-4'>{bankInfo.branch}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>


                    <h3 className="text-base mt-[8px] mb-[5px] font-semibold">Amount</h3>
                    <div>
                        <input type="text" id="amount" name="amount" value={input.amount} onChange={(event)=>handleAmount(event.target.value)} placeholder="Enter Amount" className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" required />
                    </div>

                    <button type="submit" className=" text-white bg-[#1A202C] py-[10px] rounded-[3px] w-full text-base cursor-pointer flex justify-center my-4 border border-black hover:bg-white hover:text-black hover:border hover:border-black">
                        Instant Transfer
                    </button>

                    <p className='text-[#55585B]'>Your have {currentBalance} in your account.  You can transfer any amount minimum ৳500</p>
                </form>

                
            </main>

            <style>{`
            select:required:invalid {
                color: gray;
            }
            option[value=""][disabled] {
                display: none;
            }
            option {
                color: black;
            }
            `}</style>

        </div>
    );
};

export default InstantTransfer;