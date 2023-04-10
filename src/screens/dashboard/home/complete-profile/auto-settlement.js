import React, { useEffect, useState, useContext } from "react";
import { ReactComponent as CloseBtn } from '../../../../assets/icons/close.svg';
import BlackButton from "../../../../components/BlackButton";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import PostLoginPostApi from "../../../../components/api/PostLoginPostApi";

// Context
import UserBasicInfoQRContext from "../../../../components/context/UserBasicInfoQRContext";
import RootContext from "../../../../components/context/RootContext";


export default function AutoSettlement() {

    const navigate = useNavigate();
    const [autoSettlementOption, setAutoSettlementOption] = useState(null);



    const rootContextValue = useContext(RootContext);
    const UserBasicInfoContextData = useContext(UserBasicInfoQRContext);


    // Check already exists or not
    useEffect(() => {
        setAutoSettlementOption(UserBasicInfoContextData?.business_info?.settlement_type);
        console.log(UserBasicInfoContextData?.business_info?.settlement_type);
    }, [UserBasicInfoContextData?.business_info?.settlement_type]);



    const submitFormData = (event) => {
        event.preventDefault();


        if (autoSettlementOption === null) {
            toast.error("Please select at least one auto settlement.");
            return;
        }

        PostLoginPostApi("merchant/auto-settlement", JSON.stringify({ type: autoSettlementOption })).then((resJSON) => {
            let res = JSON.stringify(resJSON);
            res = JSON.parse(res);

            if (res["status"] === 1) {
                let resData = JSON.stringify(res["data"]);
                resData = JSON.parse(resData);

                if (resData["code"] === 200) {
                    rootContextValue.forceUpdate('viewProfile');
                    toast.success("Auto settlement set successfully.");
                    return navigate("/dashboard/home", {
                        state: {
                            isReload: 1
                        }
                    });
                    // return navigate("/home");
                }

                toast.error("A problem occur. Please try again.");
            }
        }).catch((err) => {
            console.log(err);
            toast.error("A problem occur. Please try again.");
        });
    }



    return (
        <div className="font-medium min-h-[100vh] w-[100%] h-[100%] custom-container-left custom-scroll-auto">

            <div className="font-medium pb-[60px]">
                <header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[60px]">
                    <Link to="/dashboard/home"><CloseBtn /></Link>
                    <p className="text-xl text-black">Settlement Type</p>
                    <div className="mr-3"></div>
                </header>

                <main className="max-w-3xl m-auto">
                    <div className="flex justify-center ">
                        <form action='' method='POST' className="w-full" onSubmit={(event) => submitFormData(event)} >
                            <p className="text-xl text-[#222222] leading-5 py-2 block">Auto Settlement</p>
                            <div className="px-3 py-3 border border-[#DDDDDD] rounded-md my-2 mb-6">



                                <div className="w-full">
                                    <div className="wrapper">

                                        {(autoSettlementOption === "daily") ?
                                            <input type="radio" name="select" id="option-1" value="daily" onChange={(e) => setAutoSettlementOption(e.currentTarget.value)} defaultChecked />
                                            :
                                            <input type="radio" name="select" id="option-1" value="daily" onChange={(e) => setAutoSettlementOption(e.currentTarget.value)} />
                                        }
                                        <label htmlFor="option-1" className="option option-1">
                                            <div className="dot"></div>
                                            <span>Daily</span>
                                        </label>

                                        {(autoSettlementOption === "weekly") ?
                                            <input type="radio" name="select" id="option-2" value="weekly" onChange={(e) => setAutoSettlementOption(e.currentTarget.value)} defaultChecked />
                                            :
                                            <input type="radio" name="select" id="option-2" value="weekly" onChange={(e) => setAutoSettlementOption(e.currentTarget.value)} />
                                        }
                                        <label htmlFor="option-2" className="option option-2">
                                            <div className="dot"></div>
                                            <span>Weekly</span>
                                        </label>

                                        {(autoSettlementOption === "monthly") ?
                                            <input type="radio" name="select" id="option-3" value="monthly" onChange={(e) => setAutoSettlementOption(e.currentTarget.value)} defaultChecked />
                                            :
                                            <input type="radio" name="select" id="option-3" value="monthly" onChange={(e) => setAutoSettlementOption(e.currentTarget.value)} />
                                        }
                                        <label htmlFor="option-3" className="option option-3">
                                            <div className="dot"></div>
                                            <span>Monthly</span>
                                        </label>


                                        {(autoSettlementOption === "quarterly") ?
                                            <input type="radio" name="select" id="option-4" value="quarterly" onChange={(e) => setAutoSettlementOption(e.currentTarget.value)} defaultChecked />
                                            :
                                            <input type="radio" name="select" id="option-4" value="quarterly" onChange={(e) => setAutoSettlementOption(e.currentTarget.value)} />
                                        }
                                        <label htmlFor="option-4" className="option option-4">
                                            <div className="dot"></div>
                                            <span>Quarterly</span>
                                        </label>

                                        {(autoSettlementOption === "withdraw_request") ?
                                            <input type="radio" name="select" id="option-5" value="withdraw_request" onChange={(e) => setAutoSettlementOption(e.currentTarget.value)} defaultChecked />
                                            :
                                            <input type="radio" name="select" id="option-5" value="withdraw_request" onChange={(e) => setAutoSettlementOption(e.currentTarget.value)} />
                                        }

                                        <label htmlFor="option-5" className="option option-5">
                                            <div className="dot"></div>
                                            <span>Not Required</span>
                                        </label>

                                    </div>
                                </div>


                            </div>

                            <BlackButton name="Next" />


                        </form>
                    </div>
                </main>
            </div>

            <style>{`
            * :disabled {
                background-color: #F5F5F5 !important;
            }

            label > input[type='radio'] {
                display: none;
            }

            label > input[type="radio"] + *::before {
                color: #008a5d !important;
                content: " ";
                display: inline-grid;
                width: 1.1rem;
                height: 1.1rem;
                border-radius: 50%;
                border-style: solid;
                border-width: 0.1rem;
                border-color: #008a5d;
                margin-top: 5px;
            }

            label > input[type="radio"]:checked + *::before {
                background: radial-gradient(teal 0%, teal 40%, transparent 50%, transparent);
                border-color: #008a5d;
            }

            label > input[type="radio"] + * {
                display: inline-block;
                padding: 0.5rem;
            }


            .wrapper{
                display: flex;
                background: #fff;
                width: 100%;
                height: 70px;
                align-items: center;
                justify-content: space-evenly;
                border-radius: 5px;
                padding: 10px 0px;
            }

            .wrapper .option{
                background: #fff;
                height: 100%;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-evenly;
                margin: 0 10px;
                border-radius: 5px;
                cursor: pointer;
                padding: 0;
                border: 2px solid lightgrey;
                transition: all 0.3s ease;
            }
            .wrapper .option .dot{
                height: 20px;
                width: 20px;
                background: #d9d9d9;
                border-radius: 50%;
                position: relative;
                display: none;
            }
            .wrapper .option .dot::before{
                position: absolute;
                content: "";
                top: 4px;
                left: 4px;
                width: 12px;
                height: 12px;
                background: #008a5d;
                border-radius: 50%;
                opacity: 0;
                transform: scale(1.5);
                transition: all 0.3s ease;
            }
            input[type="radio"] {
                display: none;
            }
            #option-1:checked:checked ~ .option-1,
            #option-2:checked:checked ~ .option-2,
            #option-3:checked:checked ~ .option-3,
            #option-4:checked:checked ~ .option-4,
            #option-5:checked:checked ~ .option-5{
                border-color: #008a5d;
                background: #008a5d;
            }
            #option-1:checked:checked ~ .option-1 .dot,
            #option-2:checked:checked ~ .option-2 .dot,
            #option-3:checked:checked ~ .option-3 .dot,
            #option-4:checked:checked ~ .option-4 .dot,
            #option-5:checked:checked ~ .option-5 .dot{
                background: #fff;
            }
            #option-1:checked:checked ~ .option-1 .dot::before,
            #option-2:checked:checked ~ .option-2 .dot::before,
            #option-3:checked:checked ~ .option-3 .dot::before,
            #option-4:checked:checked ~ .option-4 .dot::before,
            #option-5:checked:checked ~ .option-5 .dot::before{
                opacity: 1;
                transform: scale(1);
            }
            .wrapper .option span{
                font-size: 16px;
                color: #808080;
            }
            #option-1:checked:checked ~ .option-1 span,
            #option-2:checked:checked ~ .option-2 span,
            #option-3:checked:checked ~ .option-3 span,
            #option-4:checked:checked ~ .option-4 span,
            #option-5:checked:checked ~ .option-5 span{
                color: #fff;
            }

        `}</style>


        </div>
    );
}
