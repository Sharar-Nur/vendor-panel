
import React, { useContext, useState } from 'react';
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';
import { toast } from 'react-toastify';
import PostLoginPostApi from '../../../components/api/PostLoginPostApi';

import RootContext from '../../../components/context/RootContext';



const InstantTransferStep2 = () => {


    const rootContextValue = useContext(RootContext);

    const state = useLocation();
    const navigate = useNavigate();

    // Default Input Setup
    const [input, setInput] = useState({
        beneficiary_id: "",
        amount: "",
        pin: "",
        charge: "",
        total_payable: ""
    });

    // Submit Form
    const submitFormData = (event) => {
        event.preventDefault();


        // API Call
        try {
            PostLoginPostApi("transaction/instant-money-transfer/execute", JSON.stringify(input)).then((responseJSON) => {
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        toast.success("Instant Transfer successful.");
                        rootContextValue.forceUpdate("transfer");

                        return navigate("/dashboard/home");
                    }

                    toast.error(responseData["messages"].toString());
                    return;
                }

                toast.error("A problem occur. Please try again.");
                return;
            });
        }
        catch (ex) {
            toast.error("A problem occur while API call. Please try again.");
            console.log(ex.toString());
        }
    }

    const [bankInfo, setBankInfo] = useState({
        logo: "",
        name: "",
        code: "",
        branch: "",
        acc_no: "",
        acc_name: ""
    });

    useEffect(() => {
        if (state?.state?.info === null || state?.state?.info === undefined || state?.state?.info === "" || state?.state?.input === null || state?.state?.input === undefined || state?.state?.input === "") {
            toast.error("No valid data found.");
            return navigate("/dashboard/instant-transfer/bank-lists");
        }

        let data = state?.state?.info?.summary;
        setBankInfo({ logo: data?.recipient?.bank?.logo, name: data?.recipient?.bank?.bank_name, code: data?.recipient?.bank?.code, branch: data?.recipient?.branch?.name, acc_no: data?.recipient?.ac_no, acc_name: data?.recipient?.name });
        setInput({ ...input, beneficiary_id: state?.state?.input?.beneficiary_id, amount: state?.state?.input?.amount, charge: data?.charge, total_payable: data?.total_payable });

    }, [navigate, state]);


    return (
        <div className="font-medium min-h-[100vh] w-[100%] h-[100%] custom-container-left custom-scroll-auto">

            <header className="p-4 border-b-2 border-dark-white ">
                <Link to="/dashboard/instant-transfer/bank-lists"><CloseBtn className="float-left" /></Link>
                <p className="text-center text-lg font-semibold">Instant Transfer</p>
            </header>

            <main className="max-w-5xl m-auto my-8">

                <form action='' method='POST' className="w-full" autoComplete='off' onSubmit={(event) => submitFormData(event)} >

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


                    <div className="flex flex-col w-full pt-5">
                        <div className='overflow-x-auto pb-5 pt-0'>
                            <div className='min-w-full inline-block align-middle'>
                                <div className='border rounded-lg shadow overflow-hidden'>
                                    <table className='min-w-full divide-y divide-gray-200'>
                                        <thead className='bg-neutral-100'>
                                            <tr className='text-left '>
                                                <th scope="col" className="px-6 py-3 border-r-2">Transfer Amount</th>
                                                <th scope="col" className="px-6 py-3 text-center border-r-2">Charge (1% + 25.00 BDT)</th>
                                                <th scope="col" className="px-6 py-3 text-right">Total BDT</th>
                                            </tr>
                                        </thead>

                                        <tbody className='divide-y divide-gray-200'>
                                            <tr key={1}>
                                                <td className='px-6 py-4'>৳{input.amount}</td>
                                                <td className='px-6 py-4 text-center'>{input.charge}</td>
                                                <td className='px-6 py-4 text-right'>{input.total_payable}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>


                    <h3 className="text-base mt-[8px] mb-[5px] font-semibold">Enter PIN</h3>
                    <div>
                        <input type="password" minLength={4} maxLength={4} autoComplete="off" id="pin" name="pin" value={input.pin} onChange={(event) => setInput({ ...input, pin: event.currentTarget.value })} placeholder="Enter PIN" className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" required />
                    </div>


                    <button type="submit" className=" text-white bg-[#1A202C] py-[10px] rounded-[3px] w-full text-base cursor-pointer flex justify-center my-4 border border-black hover:bg-white hover:text-black hover:border hover:border-black">
                        Instant Transfer
                    </button>

                    {/* <p className='text-[#55585B]'>Your have ৳ 25,000 in your account.  You can transfer any amount minimum ৳ 500</p> */}
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

export default InstantTransferStep2;