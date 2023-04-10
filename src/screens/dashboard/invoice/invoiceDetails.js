import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg';
import BlackButton from '../../../components/BlackButton';
import ProPic from './../../../assets/images/pro_pic.jpg'
import ShwapnoIcon from './../../../assets/icons/shopno.png'
import { useState } from 'react';
import { useEffect } from 'react';
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';

const InvoiceDetails = () => {
    const [details, setDetails] = useState({});
    const { id } = useParams();

    useEffect(() => {
        try {
            PostLoginGetApi(`shop/invoice/${id}`).then((responseJSON) => {
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        setDetails(responseData["data"]);
                    }
                }

            }).catch((err) => {
                console.log(err);
            });
        }
        catch (ex) {
            console.log(ex);
        }
    }, [])

    return (
        <div className="h-full leading-4" >
            <header className="flex justify-between items-center p-4 border-b-2 border-dark-white ">
                <Link to="/dashboard/invoice"><CloseBtn className="float-left" /></Link>
                <p className="text-xl">Scheduled Invoice</p>
                <div>
                    <input type="button" value="Send" className="bg-[#00D632] text-white py-[10px] px-5 leading-6 rounded-[3px] hover:cursor-pointer hover:bg-green-500"></input>
                </div>
            </header>
            <main className="max-w-2xl m-auto py-[60px]">
                {/* Save as Connect */}

                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center ">
                        {/* <img src={proPic} alt="pro pic" className="rounded-full " /> */}
                        <img src={details?.user?.avatar} alt="user pic" className="w-[80px] h-[80px] object-cover rounded-full" />

                        <div className="ml-3">
                            <h4 className="mb-[5px] text-[#222222]">{details?.user?.name}</h4>
                            <p className='text-sm text-[#999999]'>{details?.user?.mobile_no}</p>
                        </div>
                    </div>
                    <div className='text-sm  leading-[14px] text-end'>
                        <p className="text-ash mb-1">Will be sent on</p>
                        <p>Tomorrow, 10:00 PM ******</p>
                    </div>
                </div>


                <div className='flex justify-between bg-neutral-100 p-5 mb-[30px] rounded-[5px]'>
                    <div className='flex items-center py-s'>
                        <img src={details?.merchant?.avatar} alt="" className='mr-2.5 w-20 object-cover rounded-full' />
                        <p className='text-xl'>{details?.merchant?.name}</p>
                    </div>

                    <div className='text-end text-[#444444]'>
                        <p className='mb-2.5'>{details?.merchant?.mobile_no}</p>
                        <p className='mb-2.5'>{details?.merchant?.email}</p>
                        <p className='mb-2.5'>{details?.merchant?.address}</p>
                        {/* <p>Dhaka - 1203</p> */}
                    </div>

                </div>

                <p className='text-xl mb-[30px] text-[#222222] leading-5'>Invoice for {details?.merchant?.name}</p>

                <div className='flex justify-between'>

                    <div>
                        <p className='text-sm text-[#444444] mb-2.5 leading-[14px]'>Receipant Details</p>
                        <p className=' font-medium mb-2.5'>{details?.user?.name}</p>
                        <p className='mb-2.5'>{details?.user?.mobile_no}</p>
                        <p>{details?.user?.email}</p>
                    </div>



                    <div className='mb-[30px]'>
                        <p className='text-sm text-[#444444] mb-2.5 leading-[14px]'>Invoice ID</p>
                        <p className='text-[#8B8F97] font-semibold mb-[15px]'>{details?.invoice_id}</p>

                        <p className='text-sm text-[#444444] mb-2.5 leading-[14px]'>Create Date</p>
                        <p className='text-[#222222] mb-[15px]'>{details?.created_at_date}</p>

                        <p className='text-sm text-[#444444] mb-2.5 leading-[14px]'>Expire Date</p>
                        <p className='text-[#222222]'>{details?.due_date}</p>

                    </div>
                </div>

                {/* <div className='p-5 rounded-md flex justify-between mb-2.5' style={{ background: "rgba(250, 168, 25, 0.1)" }}>
                    <div>
                        <p className='text-[#444444] mb-2.5'>Pick-up Time</p>
                        <p className='text-xl text-[#222222]'>{orderDetails.pickup_time}</p>
                    </div>
                    <div className='text-end'>
                        <p className='text-[#444444] mb-2.5 text-right pr-1'>Order Status</p>
                        <div className='py-[5px] px-5 bg-[#FAA819] rounded-[18px] text-white' >
                            <p>{orderDetails.status}</p>
                        </div>
                    </div>
                </div> */}

                <div className='p-5 rounded-md flex justify-between  bg-[#FDEFF4]'>
                    <div>
                        <p className='text-[#444444] mb-2.5'>Total Amount</p>
                        <p className='text-xl text-[#222222] leading-5'>{details?.total_bill_amount}</p>
                    </div>
                    <div className='text-end'>
                        <p className='text-[#444444] mb-2.5 text-right '>Invoice Status</p>
                        <div className='py-[5px] inline-block px-5 bg-[#FC5182] rounded-[18px] text-white'>
                            <p>{details?.status_alias}</p>
                        </div>
                    </div>
                </div>

                <h3 className='text-xl my-[30px] text-[#222222] leading-5'>Item/Service Details</h3>

                <div className='mb-[30px]'>

                    <div>
                        {
                            details?.items?.map((data, index) =>
                                <div key={index} className='flex justify-between items-center mb-[15px]'>


                                    <p className='text-[#222222] mb-2.5 font-medium'>{data.quantity} x {data.name}</p>
                                    {/* <p className='text-[#444444]'>5 kg pack</p> */}

                                    <p className='font-medium '>৳ {data.unit_price * data.quantity}</p>
                                </div>
                            )
                        }

                    </div>

                    <hr className='my-5 bg-[#DDDDDD]' />

                    <div className='flex justify-end text-[#222222] space-x-36'>

                        <div className='flex flex-col space-y-5 font-medium'>
                            <p>Subtotal</p>
                            <p>Discount</p>
                            <p>Delivery Charge</p>
                            <p>Tax</p>
                        </div>
                        <div className='flex flex-col space-y-5 text-right font-medium'>
                            <p>৳ {details?.final_bill_amount}</p>
                            <p>৳ {details?.discount_amount}</p>
                            <p>৳ {details?.delivery_charge_amount}</p>
                            <p>৳ {details?.vat_tax_amount}</p>
                        </div>
                    </div>

                </div>

                <h3 className='text-xl mb-2.5 text-[#222222] leading-5'>Notes</h3>

                <p className='text-[#55585B] text-sm leading-[22px] mb-[30px]'>
                    Mobile invoicing is an easy way to bill your clients right from your mobile device so they can pay you quickly and securely. Now you can send and manage electronic invoices on your device for Free
                </p>

                <BlackButton name="Send Now" />
            </main>
        </div>
    );
};

export default InvoiceDetails;