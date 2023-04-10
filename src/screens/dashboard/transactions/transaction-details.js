import React, { Suspense, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg'
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';
import moment from 'moment';

const BlackButton = React.lazy(()=>{ return import("../../../components/BlackButton") });



const TransactionDetails = () => {

    const navigate = useNavigate();
    const location = useLocation();
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
    },[]);


    const [details, setDetails] = useState({});
    useEffect(()=>{
        if(transactionData.length !== 0) {
            PostLoginGetApi("user/transaction/details/"+transactionData["transaction_id"]).then((responseJSON)=>{
                var response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    var responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if(responseData.code === 200) {
                        setDetails(responseData.data);
                    }
                }

            }).catch((error)=> {
                console.log(error);
            });
        }

    },[transactionData]);


    const navigateBack = () => {
        navigate("/dashboard/transactions", {
            state: {
                reqParam: location?.state?.param
            }
        });
        return;
    }


    const customDateFormat = (date) => {
        date = date.toString();

        let day="", month="", year="";
        let counter = 0;
        for(var i=0; i<date.length; i++ ) {
            
            if( date[i] === "/" || date[i] === " " ) {
                counter++;
                continue;
            }

            if( counter === 0 ) {
                day += date[i].toString();
            }
            else if(counter === 1) {
                month += date[i].toString();
            }
            else if( counter === 2) {
                year += date[i].toString();
            }
        }

        return month + "/" + day + "/" + year;
    }


    return (
        <div className='h-[100vh] bg-white'>
            
            <header className="text-center p-4 border-b-2 border-dark-white mb-[40px] flow-root">
                <Link to="/dashboard/transactions" state={{param: location?.state?.param}}><CloseBtn className="float-left mt-2" /></Link>
                <p className='text-xl mt-2 flow-root'>Transaction Details</p>
                
                {(transactionData["type_of_tx"]==="Credit" && transactionData["transaction_type"] !== "Refund" && transactionData["refunded"] === true )? 
                    <Link to="/dashboard/transaction/refund-step-one" state={{transaction:transactionData}} className="float-right text-white bg-[#00D632] px-4 py-[7px] text-base font-medium rounded cursor-pointer flex justify-center -mt-9">
                        Refund Money
                    </Link>
                    : ""
                }

            </header>

            <main className="max-w-2xl m-auto ">
                

                {(transactionData.length===0)?(
                    <p className='text-center text-lg font-semibold'>Please wait....</p>
                ):(
                    <>
                        <div className='flex w-full mt-5'>
                            <div className='block float-left w-1/2'>
                                <h1 className="text-xl font-semibold">
                                    {
                                        (transactionData["transaction_type"]==="Refund")?
                                        "Money Refunded":
                                        transactionData["transaction_type"]
                                    }
                                </h1>
                                <p className='text-md text-[#8B8F97] py-1 pb-3'>Transaction ID : {transactionData["transaction_id"]}</p>
                            </div>

                            <div className='block float-right text-right w-1/2'>
                                <h1 className="text-2xl font-semibold" style={{color: transactionData["new"]["amount_color_code"]}}>
                                    {transactionData["amount"]} {transactionData["currency"]}
                                </h1>
                                <p className="text-ash text-md">
                                    {
                                        (transactionData["type_of_tx"]==="Credit")?(transactionData["transaction_type"]==="Refund")?"Refunded from":"Received from":"Sent to"
                                    }
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between border border-solid border-neutral-100 p-3 px-4 rounded bg-[#F5F5F5]">
                            <div className="flex items-center">
                                {(transactionData["transaction_type"]==="Withdraw Bank" )?
                                    <img src={transactionData["new"]["photo"]} alt={transactionData["new"]["title"]} className="rounded-md w-[60px] h-[60px] object-cover" />
                                :
                                    <img src={transactionData["new"]["photo"]} alt={transactionData["new"]["title"]} className="w-[60px] h-[60px] rounded-[50%] object-cover" />
                                }
                                
                                <div className="ml-4">
                                    <h4 className="text-lg font-semibold">{transactionData["new"]["title"]}</h4>
                                    <p className='text-md text-[#999999]'>{(transactionData["source"])?transactionData["source"]["mobile_no"]:transactionData["destination"]["mobile_no"]}</p>
                                </div>
                            </div>
                            {/* <div>
                                <p className="text-ash mb-2.5">Account Type</p>
                                <p className="text-end">Consumer</p>
                            </div> */}
                        </div>

                        <div className="my-5 flow-root px-2 pb-5">
                            <p className="mb-3 text-lg text-black">Transaction Details</p>

                            <div className="block text-secondary text-md">
                                <div className='flex py-1'>
                                    <p className="float-left w-1/3">Status</p>
                                    <p className="text-right w-2/3">{transactionData["title"]} {(transactionData["type_of_tx"]==="Credit")?" Received":""}</p>
                                </div>

                                <div className='flex py-1' style={{borderTop: "2px dotted #F5F5F5"}}>
                                    <p className="float-left w-1/3">Nature of Transaction</p>
                                    <p className="text-right w-2/3">{transactionData["nature_of_transaction"]}</p>
                                </div>

                                <div className='flex py-1' style={{borderTop: "2px dotted #F5F5F5"}}>
                                    <p className="float-left w-1/3">Transaction Amount</p>
                                    <p className="text-right w-2/3">{transactionData["new"]["total_amount"]}</p>
                                </div>
                                <div className='flex py-1' style={{borderTop: "2px dotted #F5F5F5"}}>
                                    <p className="float-left w-1/3">Charge</p>
                                    {/* <p className="text-right w-2/3">{(transactionData["new"]["fee"]==="0.00")?"N/A":transactionData["new"]["fee"]}</p> */}
                                    <p className="text-right w-2/3">{details?.charge}</p>
                                </div>
                                {/* <div className='flex py-1' style={{borderTop: "2px dotted #F5F5F5"}}>
                                    <p className="float-left w-1/3">Send Money Charge</p>
                                    <p className="text-right w-2/3">{transactionData["new"]["sender_charge"]}</p>
                                </div> */}
                                {/* <div className='flex py-1' style={{borderTop: "2px dotted #F5F5F5"}}>
                                    <p className="float-left w-1/3">Total Amount</p>
                                    <p className="text-right w-2/3">{transactionData["new"]["total_amount"]}</p>
                                </div> */}
                                <div className='flex py-1' style={{borderTop: "2px dotted #F5F5F5"}}>
                                    <p className="float-left w-1/3">Transaction Date</p>
                                    <p className="text-right w-2/3">
                                    {moment(customDateFormat(transactionData["new"]["created_at"].toString().substring(9))).format('DD MMM, YYYY')}
                                    </p>
                                </div>
                                <div className='flex py-1' style={{borderTop: "2px dotted #F5F5F5"}}>
                                    <p className="float-left w-1/3">Transaction Time</p>
                                    <p className="text-right w-2/3">
                                        {transactionData["new"]["created_at"].toString().substring(0,8)}
                                    </p>
                                </div>
                                

                                <div className='flex py-1' style={{borderTop: "2px dotted #F5F5F5"}}>
                                    <p className="float-left w-1/3">Reference</p>
                                    <p className="text-right w-2/3">{details?.reference}</p>
                                </div>
                                
                                <div className='flex py-1' style={{borderTop: "2px dotted #F5F5F5", borderBottom: "2px dotted #F5F5F5"}}>
                                    <p className="float-left w-1/3">Remarks</p>
                                    <p className="text-right w-2/3">{transactionData["new"]["remarks"]}</p>
                                </div>
                                
                                
                            </div>
                        </div>
                        <Suspense>
                            <BlackButton name="Back to Transaction List" onClick={navigateBack}></BlackButton>
                        </Suspense>
                    </>
                )}

                
            </main>
        </div>
    );
};

export default TransactionDetails;