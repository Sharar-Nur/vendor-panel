import React, {useEffect, useState} from 'react';
import { toast } from 'react-toastify';
import PostLoginGetApi from './api/PostLoginGetApi';
import PostLoginPostApi from './api/PostLoginPostApi';
import moment from 'moment';
import $ from "jquery";

import Popup from './Popup';
import { ReactComponent as CloseBtn } from './../assets/icons/close.svg';

const Voucher = () => {

    const [redeemCounter, setRedeemCounter] = useState(0);
    const [voucherList, setVoucherList] = useState([]);
    useEffect(()=>{
        PostLoginGetApi("merchant/voucher/list").then((responseJSON)=>{
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if(response["status"]===1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if(responseData["code"]===200) {
                    setVoucherList(responseData["data"]);
                }
            }
        }).catch((error)=>{
            console.log(error);
        });
    },[redeemCounter]);

    const [isOpen, setIsOpen] = useState(false);

    const [voucherCode, setVoucherCode] = useState("");
    const [voucherInfo, setVoucherInfo] = useState([]);

    const submitForm = () => {

        if(voucherCode === "") {
            toast.error("Please enter voucher code.");
            return;
        }

        // API CALL
        PostLoginPostApi("merchant/voucher/validation", JSON.stringify({voucher_code:voucherCode})).then((responseJSON)=>{
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if(response["status"]===1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if(responseData?.code === 200) {
                    if(responseData?.data?.length === 0) {
                        toast.error("No active voucher code found.");
                        return;
                    }

                    setIsOpen(true);
                    setVoucherInfo(responseData?.data);

                    return;
                }
            }

            toast.error("No active voucher code found.");
            return;

        }).catch((error)=>{
            console.log(error);
        });

        return;
    }


    useEffect(()=>{
        $(".SubmitBtn").attr("disabled",true);
        if(voucherCode.toString().length === 8) {
            $(".SubmitBtn").attr("disabled",false);
        }
    },[voucherCode]);


    const redeemVoucher = (code) => {
        $("#redeem-button").html("Please wait...");
        $("#redeem-button").attr("disabled",true);

        PostLoginPostApi("merchant/voucher/redeem",JSON.stringify({voucher_code:code})).then((responseJSON)=>{
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if(response["status"]===1) {
                toast.success("Voucher redeemed successfully.");
                
                setRedeemCounter((prevCounter)=>{
                    return prevCounter+1;
                });
                
                setIsOpen(false);
                setVoucherInfo([]);
                setVoucherCode("");

                console.log(response);
                return;
            }


            toast.error("A problem occur while redeem the voucher. Please try again.");

        }).catch((error)=>{
            toast.error("A problem occur. Please try again.");
            console.log(error);
        });
    }
    

    return (
        <>
            <div className='w-full pl-5 py-5'>
                <h6 className="w-1/2 text-2xl fixed pt-4 font-medium pb-0 float-left">
                    Here’s your vouchers at a glance
                </h6>

                <div className="w-1/2 font-medium pb-0 float-right mr-5">
                    <div className="flex form-body items-center  bg-white float-right">
                        <div className="relative w-[300px] bg-white px-2 rounded-md border border-gray-300">
                            <input type="text" id="voucherCodeInput" name="voucherCodeInput" autoComplete='off' className="block pl-0.5 rounded-t-lg px-2.5 pb-2 pt-6 w-full text-[15px] text-[#222222] bg-white dark:bg-gray-700 border-0 border-b-2 border-white appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-[#34A853] peer" minLength={8} maxLength={8} placeholder=" " value={voucherCode} 
                            onChange={(e)=>setVoucherCode(e.target.value.toString().toUpperCase())} required />

                            <label htmlFor="voucherCodeInput" className="absolute text-base pt-1 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-2.5 peer-focus:text-[#34A853] peer-focus:dark:text-[#34A853] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">Enter Voucher Code</label>
                        </div>

                        <button type="button" onClick={submitForm} className="SubmitBtn text-white bg-primary px-10 py-4 ml-3 rounded cursor-pointer hover:bg-brand-dark disabled:bg-gray-300">
                            Validate Voucher
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full pt-5">
                <div className='-m-1.5 overflow-x-auto p-5 pt-0'>
                    <div className='p-1.5 min-w-full inline-block align-middle'>
                        <div className='border rounded-lg shadow overflow-hidden'>
                            <table className='min-w-full divide-y divide-gray-200 custom-table-hover'>
                                <thead className='bg-neutral-100'>
                                    <tr className='text-left '>
                                        <th scope="col" className="px-6 py-3 border-r-2 text-center w-10">#</th>
                                        <th scope="col" className="px-6 py-3">Bundle name</th>
                                        <th scope="col" className="px-6 py-3 text-center">Face value</th>
                                        <th scope="col" className="px-6 py-3 text-center">Sell price</th>
                                        <th scope="col" className="px-6 py-3 text-center">Expired at</th>
                                        <th scope="col" className="px-6 py-3 text-center">Total Card</th>
                                        <th scope="col" className="px-6 py-3 text-center">Unused</th>
                                        <th scope="col" className="px-6 py-3 text-center">Purchased</th>
                                        <th scope="col" className="px-6 py-3 text-center" >Redeemed</th>
                                        {/* <th className='rounded-tr-lg text-center max-w-[100px]'>Action</th> */}
                                    </tr>
                                </thead>

                                <tbody className='divide-y divide-gray-200 '>
                                    {(voucherList.length > 0) ? voucherList.map( (val,index) => 
                                        <tr key={index}>
                                            <td className='px-6 py-4 border-r-2'>{index+1}</td>
                                            <td className='px-6 py-4 border-r-2'>{val?.bundle_name}</td>
                                            <td className='px-6 py-4 border-r-2 text-center'>{val?.face_value}</td>
                                            <td className='px-6 py-4 border-r-2 text-center'>{val?.sell_price}</td>
                                            <td className='px-6 py-4 border-r-2 text-center'>{moment(val?.expired_at).format("DD MMM, YYYY")}</td>
                                            <td className='px-6 py-4 border-r-2 text-center'>{val?.total_card}</td>
                                            <td className='px-6 py-4 border-r-2 text-center'>{val?.unused}</td>
                                            <td className='px-6 py-4 border-r-2 text-center'>{val?.purchased}</td>
                                            <td className='px-6 py-4 text-center'>{val?.redeemed}</td>
                                        </tr>
                                    ) : 
                                        <tr>
                                            <td colSpan={8} className="px-6 py-4 text-center">No voucher available.</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>


            {/* MODAL WINDOW */}
            <div>
                {(isOpen===true && voucherInfo?.length === 1) && <Popup content={
                    <div className="p-5 font-medium">

                        <div className="flex justify-between">
                            <h3 className="text-xl">Voucher Details</h3>
                            <CloseBtn onClick={()=>setIsOpen(false)} className="cursor-pointer" />
                        </div>

                        <hr className="bg-dark-white my-5" />
                        
                        <table id="voucher-details-table" className="custom-details-table w-full mt-0 mb-5">
                            <tbody>
                                <tr>
                                    <td className="font-semibold text-base">Voucher Code</td>
                                    <td className="px-5 text-base">{voucherInfo[0]?.voucher_code}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-base">Operator</td>
                                    <td className="px-5 text-base">{voucherInfo[0]?.operator}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-base">Bundle Name</td>
                                    <td className="px-5 text-base">{voucherInfo[0]?.bundle_name}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-base">Expire</td>
                                    <td className="px-5 text-base">{voucherInfo[0]?.expired_at}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-base">Face Value</td>
                                    <td className="px-5 text-base">{voucherInfo[0]?.face_value}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-base">Sell Price</td>
                                    <td className="px-5 text-base">{(voucherInfo[0]?.sell_price===null) ? "-" : voucherInfo[0]?.sell_price}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-base">Status</td>
                                    <td className="px-5 text-base">{(voucherInfo[0]?.status===1)? "Unused" : "Redeemed"}</td>
                                </tr>
                            </tbody>
                        </table>    

                        {(voucherInfo[0]?.status===1 && 
                            <button onClick={()=>redeemVoucher(voucherInfo[0]?.voucher_code)} type="button" id="redeem-button" className="text-white bg-primary py-3 text-lg rounded cursor-pointer w-full hover:bg-brand-dark disabled:bg-gray-400 disabled:cursor-wait">
                                Redeem Voucher
                            </button>
                        )}

                    </div>}
                />}
            </div>







        </>
    );
};

export default Voucher;