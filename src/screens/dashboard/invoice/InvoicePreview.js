import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg';
import BlackButton from '../../../components/BlackButton';
import ProPic from './../../../assets/images/pro_pic.jpg'
import ShwapnoIcon from './../../../assets/icons/shopno.png'
import { useEffect } from 'react';
import UserBasicInfoContext from '../../../components/context/UserBasicInfoContext';
import UserBasicInfoQRContext from '../../../components/context/UserBasicInfoQRContext';
import moment from 'moment';
import { toast } from 'react-toastify';
import PostLoginPostApi from '../../../components/api/PostLoginPostApi';
import $ from "jquery";

const InvoicePreview = () => {

    // const testUserData = useContext(UserBasicInfoContext);
    const userQrBasicInfo = useContext(UserBasicInfoQRContext);


    const { state } = useLocation();
    const [sum, setSum] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {

        if (state.connect === undefined) {
            // Navigate to create invoice page
            return;
        }

        sessionStorage.setItem("connectDetails", JSON.stringify(state.connect));

        state.items.map(data => (
            setSum((prev) => { return prev + (data.quantity * data.unit_price) })
        ));



    }, [state]);




    const onSubmit = () => {
        let reqBody = new FormData();


        reqBody.append("connect_id", state.connect?.id);
        // reqBody.append("customer_name", data.customer_name);
        // reqBody.append("customer_email", data.email);

        // eslint-disable-next-line array-callback-return
        state.items.map((data, index) => {
            reqBody.append("items[" + index + "][id]", data?.id);
            reqBody.append("items[" + index + "][quantity]", data?.quantity);
        });

        reqBody.append("final_bill_amount", sum);
        reqBody.append("discount_amount", $("#discount").text().substring(1));
        reqBody.append("delivery_charge_amount", $("#delivery_charge").text().substring(1));
        reqBody.append("vat_tax_amount", $("#tax").text().substring(1));
        reqBody.append("total_bill_amount", sum);


        state.invoice_details.notification_method = state.invoice_details.notification_method.toString();
        var nmArr = state.invoice_details.notification_method.split(',');
        // eslint-disable-next-line array-callback-return
        nmArr.map(data => {
            reqBody.append("notification_method[]", data);
        });

        reqBody.append("expire_after", state.invoice_details.expire_days);
        reqBody.append("title", state.invoice_details.invoice_title);
        reqBody.append("custom_invoice_id", state.invoice_details.invoice_id);
        reqBody.append("notes", state.invoice_details.note);
        reqBody.append("due_date", "2023-03-01");
        // reqBody.append("set_reminder", data.set_reminder);
        reqBody.append("schedule_at_date", state.invoice_details.date);
        reqBody.append("schedule_at_time", moment(state.invoice_details.time, 'HH:mm').format('HH:mm:ss'));



        // Create Invoice
        PostLoginPostApi("shop/invoice", reqBody, 1, 1).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    // setConnectList(responseData["data"]?.data);
                    toast.success("Invoice created successfully.");
                    return navigate("/dashboard/invoice");
                }

                toast.error("Please fill up all the fields.");
                return navigate("/dashboard/create-invoice");
            }
        }).catch((err) => {
            console.log(err);
        })


    }




    return (
        <div className="h-full leading-4" >
            <header className="flex justify-between items-center p-4 border-b-2 border-dark-white ">
                <Link to="/dashboard/create-invoice"><CloseBtn className="float-left" /></Link>
                <p className="text-xl">Scheduled Invoice</p>
                <div>
                    <input type="button" value="Send" onClick={onSubmit} className="bg-[#00D632] text-white py-[10px] px-5 leading-6 rounded-[3px] hover:cursor-pointer hover:bg-green-500"></input>
                </div>
            </header>
            <main className="max-w-2xl m-auto py-[60px]">
                {/* Save as Connect */}

                <form>
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center ">
                            {/* <img src={proPic} alt="pro pic" className="rounded-full " /> */}
                            <img src={state.connect?.user?.avatar} alt="pro pic" className="w-[80px] h-[80px] object-cover rounded-full" />

                            <div className="ml-3">
                                <h4 className="mb-[5px] text-[#222222]">{state.connect?.user?.name}</h4>
                                <p className='text-sm text-[#999999]'>{state.connect?.user?.mobile_no}</p>
                            </div>
                        </div>
                        <div className='text-sm  leading-[14px] text-end'>
                            <p className="text-ash mb-1">Will be sent on</p>
                            <p>Tomorrow, 10:00 PM****</p>
                        </div>
                    </div>


                    <div className='flex justify-between bg-neutral-100 p-5 mb-[30px] rounded-[5px]'>
                        <div className='flex items-center py-s'>
                            <img src={userQrBasicInfo.business_info.bussiness_logo} alt="Business Logo" className='mr-2.5 w-20 object-cover rounded-full' />
                            <p className='text-2xl'>{userQrBasicInfo.business_info.bussiness_name}</p>
                        </div>

                        <div className='text-end text-[#444444]'>
                            <p className='mb-2.5'>{userQrBasicInfo.user.mobile_number}</p>
                            <p className='mb-2.5'>{userQrBasicInfo.business_info.bussiness_email}</p>
                            <p className='mb-2.5'>{(userQrBasicInfo.business_info.bussiness_address[0] !== undefined) &&
                                <>
                                    {userQrBasicInfo.business_info.bussiness_address[0]?.address}, {userQrBasicInfo.business_info.bussiness_address[0]?.thana?.name}, {userQrBasicInfo.business_info.bussiness_address[0]?.district?.name} - {userQrBasicInfo.business_info.bussiness_address[0]?.post_code}, {userQrBasicInfo.business_info.bussiness_address[0]?.division?.name}
                                </>
                            }</p>
                            <p>Dhaka - 1203</p>
                        </div>

                    </div>

                    <p className='text-xl mb-[30px] text-[#222222] leading-5'>Invoice for {userQrBasicInfo.business_info.bussiness_name} Outlet</p>

                    <div className='flex justify-between'>

                        <div>
                            <p className='text-sm text-[#444444] mb-2.5 leading-[14px]'>Receipant Details</p>
                            <p className=' font-medium mb-2.5'>{state.connect?.user?.name}</p>
                            <p className='mb-2.5'>{state.connect?.user?.mobile_no}</p>
                            <p>{state.connect?.user?.email}</p>
                        </div>



                        <div className='mb-[30px]'>
                            <p className='text-sm text-[#444444] mb-2.5 leading-[14px]'>Invoice ID</p>
                            <p className='text-[#8B8F97] font-semibold mb-[15px]'>{state.invoice_details.invoice_id}</p>

                            <p className='text-sm text-[#444444] mb-2.5 leading-[14px]'>Create Date</p>
                            <p className='text-[#222222] mb-[15px]'>{moment().format("DD MMMM, YYYY").toString()}</p>

                            {/* <p className='text-sm text-[#444444] mb-2.5 leading-[14px]'>Expire Date</p>
                        <p className='text-[#222222]'>30 December, 2021</p> */}

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
                            <p className='text-xl text-[#222222] leading-5'>৳ {sum}</p>
                        </div>
                        <div className='text-end'>
                            <p className='text-[#444444] mb-2.5 text-right '>Invoice Status</p>
                            <div className='py-[5px] inline-block px-5 bg-[#FC5182] rounded-[18px] text-white'>
                                <p>Scheduled</p>
                            </div>
                        </div>
                    </div>

                    <h3 className='text-xl my-[30px] text-[#222222] leading-5'>Item/Service Details</h3>

                    <div className='mb-[30px]'>

                        <div>
                            {
                                state.items.map((data, index) =>
                                    <div key={index} className='flex justify-between items-center mb-[15px]'>


                                        <p className='text-[#222222] mb-2.5 font-medium'>{data.quantity} x {data.name}</p>
                                        {/* <p className='text-[#444444]'>5 kg pack</p> */}

                                        <p className='font-medium '>৳ {data.unit_price * data.quantity} </p>
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
                                <p>৳ {sum}</p>
                                <p id="discount">৳ 0</p>
                                <p id="delivery_charge">৳ 0</p>
                                <p id="tax">৳ 0</p>
                            </div>
                        </div>

                    </div>

                    <h3 className='text-xl mb-2.5 text-[#222222] leading-5'>Notes</h3>

                    <p className='text-[#55585B] text-sm leading-[22px] mb-[30px]'>
                        Mobile invoicing is an easy way to bill your clients right from your mobile device so they can pay you quickly and securely. Now you can send and manage electronic invoices on your device for Free
                    </p>

                    <BlackButton name="Send Now" type="button" onClick={onSubmit} />
                </form>
            </main>
        </div>
    );
};

export default InvoicePreview;