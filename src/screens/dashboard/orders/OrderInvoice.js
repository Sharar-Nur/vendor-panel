import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg';
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';
import PostLoginPostApi from '../../../components/api/PostLoginPostApi';
import BlackButton from '../../../components/BlackButton';
import DisplayPic from './../../../assets/images/pro_pic.jpg';
import Popup from '../../../components/Popup';
import OtpSpace from "../../../assets/icons/otp-space.png";
import $ from "jquery";

const OrderInvoice = (category) => {

    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState();
    const [orderItems, setOrderItems] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [isRefresh, setIsRefresh] = useState(0);

    useEffect(() => {
        try {
            PostLoginGetApi(`shop/manage/orders/${id}`).then((responseJSON) => {
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        setIsLoad(true);
                        setOrderDetails(responseData["data"]);
                        setOrderItems(responseData["data"].items);
                    }
                }

            }).catch((err) => {
                console.log(err);
            });
        }
        catch (ex) {
            console.log(ex);
        }
    }, [isRefresh])

    const handleOrderStatus = (value) => {

        // Call Request for order status

        PostLoginPostApi(`shop/manage/orders/status-update/${id}`, JSON.stringify({ status: value }), 1, 0, 0).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response['status'] === 1) {
                let responseData = JSON.stringify(response['data']);
                responseData = JSON.parse(responseData);

                if (responseData['code'] === 200) {
                    setIsRefresh((prevCounter) => {
                        return prevCounter + 1;
                    });

                    // navigate('/dashboard/store')
                }
            }
        }).catch(err => {
            console.log(err);
        })
    }


    // const handleRefund = () => {

    //     // Call Request for order status

    //     PostLoginPostApi('shop/manage/orders/refund/', JSON.stringify({ order_id: id, pin:  }), 1, 0, 0).then((responseJSON) => {
    //         let response = JSON.stringify(responseJSON);
    //         response = JSON.parse(response);

    //         if (response['status'] === 1) {
    //             let responseData = JSON.stringify(response['data']);
    //             responseData = JSON.parse(responseData);

    //             if (responseData['code'] === 200) {
    //                 setIsRefresh((prevCounter) => {
    //                     return prevCounter + 1;
    //                 });

    //                 // navigate('/dashboard/store')
    //             }
    //         }
    //     }).catch(err => {
    //         console.log(err);
    //     })
    // }




    const renderOrderInvoiceButton = () => {
        if (orderDetails.status === "Waiting for Accept") {
            return (
                <>
                    <input type="button" value="Decline Order" onClick={() => handleOrderStatus(4)} className="bg-[#DDDDDD] text-black py-2 px-5 rounded-sm hover:cursor-pointer hover:bg-gray-300 mr-3"></input>
                    <input type="button" value="Accept Order" onClick={() => handleOrderStatus(1)} className="bg-[#00D632] text-white py-2 px-5 rounded-sm hover:cursor-pointer hover:bg-green-500"></input>
                </>
            )
        }
        if (orderDetails.status === "Accepted") {
            return (

                <input type="button" value="Ready for Pick-up" onClick={() => handleOrderStatus(2)} className="bg-[#00D632] text-white py-2 px-5 rounded-sm hover:cursor-pointer hover:bg-green-500"></input>

            )
        }
        if (orderDetails.status === "Ready for Pick-up") {
            return (

                <input type="button" value="Verify OTP" onClick={() => openInstructionModel("otp")} className="bg-[#00D632] text-white py-2 px-5 rounded-sm hover:cursor-pointer hover:bg-green-500"></input>

            )
        }

        if (orderDetails.status === "Delivered") {
            return (
                <input type="button" value="Refund Order" onClick={() => openInstructionModel("pin")} className="bg-[#1A202C] text-white py-2 px-5 rounded-sm hover:cursor-pointer "></input>
            )
        }

        if (orderDetails.status === "Canceled") {
            return (
                <></>
            )
        }


    }

    const renderOrderInvoiceBigButton = () => {
        if (orderDetails.status === "Waiting for Accept") {
            return (
                <BlackButton name="Accept Order" onClick={() => handleOrderStatus(1)} />
            )
        }
        if (orderDetails.status === "Accepted") {
            return (

                <BlackButton name="Ready for Pick-up" onClick={() => handleOrderStatus(2)} />

            )
        }
        if (orderDetails.status === "Ready for Pick-up") {
            return (

                <BlackButton name="Verify OTP" onClick={() => openInstructionModel("otp")} />

            )
        }

        if (orderDetails.status === "Delivered") {
            return (
                // console.log("delivered")
                <BlackButton name="Refund" onClick={() => openInstructionModel("pin")} />
            )
        }

        if (orderDetails.status === "Canceled") {
            return (
                <></>
            )
        }
    }



    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [pin, setPin] = useState(new Array(4).fill(""));
    const [editInstruction, setEditInstruction] = useState({
        VerifyOtp2: false,
        VerifyRefund: false,
    });
    const [otpMobileNumber, setOtpMobileNumber] = useState("");

    const openInstructionModel = (id) => {
        switch (id) {
            case "otp":
                setEditInstruction({ VerifyOtp2: true });
                break;
            case "pin":
                setEditInstruction({ VerifyRefund: true });
                break;
            default:
                break;
        }
    }

    const closeInstructionModel = (value = "") => {
        if (value === "otp") {
            setOtp(new Array(6).fill(""));
            setEditInstruction({ VerifyOtp2: false });
        }
        else if (value === "pin") {
            setPin(new Array(4).fill(""));
            setEditInstruction({ VerifyRefund: false });
        }
        else {
            setEditInstruction({ VerifyOtp2: false, VerifyRefund: false });
        }
    }


    const onSubmit = (e, value) => {

        e.preventDefault();

        if (value === 'otp') {
            let otpString = otp.join('');
            if (otpString.length !== 6) {
                toast.error("Please enter valid OTP");
                return;
            }


            PostLoginPostApi("shop/manage/orders/verify-otp/" + id, JSON.stringify({ otp: otpString })).then((responseJSON) => {
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response.status === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        toast.success("OTP verified successfully.");
                        closeInstructionModel("otp");
                        setIsRefresh((prevCounter) => {
                            return prevCounter + 1;
                        });

                        return;
                    }


                    toast.error("OTP verification failed.");
                }

            }).catch((err) => {
                toast.error("A problem occur. Please try again.");
                console.log(err);
            });
        }

        else if (value === 'pin') {

            let pinString = pin.join('');
            if (pinString.length !== 4) {
                toast.error("Please enter valid PIN");
                return;
            }

            PostLoginPostApi("shop/manage/orders/refund", JSON.stringify({ order_id: id, pin: pinString })).then((responseJSON) => {
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response.status === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        toast.success("Refund successfully.");
                        closeInstructionModel();
                        setIsRefresh((prevCounter) => {
                            return prevCounter + 1;
                        });

                        return;
                    }

                    toast.error(responseData["messages"].toString());
                }

            }).catch((err) => {
                toast.error("A problem occur. Please try again.");
                console.log(err);
            });
        }


    }



    const handleChange = (element, index, value) => {
        if (isNaN(element.value)) {
            return false;
        }

        if (value === "otp") {
            setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        }

        else if (value === "pin") {
            setPin([...pin.map((d, idx) => (idx === index ? element.value : d))]);
        }


        if (element.value !== "" && element.parentNode.nextSibling) {
            element.parentNode.nextSibling.querySelector("input").focus();
        }

        if (element.value === "" && element.parentNode.previousSibling) {
            element.parentNode.previousSibling.querySelector("input").focus();
        }
    }



    return (
        <>
            {isLoad === true &&
                <div className="h-full" >
                    <header className="flex justify-between items-center p-4 border-b-2 border-dark-white ">
                        <Link to="/dashboard/orders"><CloseBtn className="float-left" /></Link>
                        <p className="text-xl">Order Paid</p>
                        <div>
                            {/* <input type="button" value="Decline Order" className="bg-[#DDDDDD] text-black py-2 px-5 rounded-sm hover:cursor-pointer hover:bg-gray-300 mr-3"></input>
                            <input type="button" value="Accept Order" className="bg-[#00D632] text-white py-2 px-5 rounded-sm hover:cursor-pointer hover:bg-green-500"></input> */}
                            {
                                renderOrderInvoiceButton()
                            }
                        </div>
                    </header>
                    <main className="max-w-2xl m-auto py-[60px]">
                        {/* Save as Connect */}

                        <div className="flex items-center justify-between py-5 rounded">
                            <div className="flex items-center ">
                                {/* <img src={proPic} alt="pro pic" className="rounded-full " /> */}
                                <img src={orderDetails.user_photo} alt="pro pic" className="rounded-md w-[100px]" />

                                <div className="ml-5">
                                    <h4 className="mb-1 text-[#222222]">{orderDetails.user_name}</h4>
                                    <p className='text-sm text-[#999999]'>{orderDetails.user_mobile}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-ash mb-1 text-sm ">Received on</p>
                                <p className="text-end text-sm">{orderDetails.created_at_time}</p>
                            </div>
                        </div>

                        <p className='text-xl mb-[30px] text-[#222222]'>Invoice for {category.category} at {orderDetails.merchant_name}</p>

                        <div className='mb-[30px]'>
                            <p className='text-sm text-[#444444] mb-[2.5]'>Transaction ID</p>
                            <p className='text-[#8B8F97] font-semibold mb-[15px]'>{orderDetails.transaction_id}</p>

                            <p className='text-sm text-[#444444] mb-[2.5]'>Create Date</p>
                            <p className='text-[#222222] mb-[15px]'>{orderDetails.created_at_date}</p>
                            {/* 
                            <p className='text-sm text-[#444444] mb-[2.5]'>Expire Date</p>
                            <p className='text-[#222222] mb-[15px]'>#</p> */}

                            <p className='text-sm text-[#444444] mb-[2.5]'>Order Type</p>
                            <p className='text-[#222222]'>{orderDetails.order_type_alias}</p>
                        </div>

                        <div className='p-5 rounded-md flex justify-between mb-2.5' style={{ background: "rgba(250, 168, 25, 0.1)" }}>
                            <div>
                                <p className='text-[#444444] mb-2.5'>{orderDetails.order_type_alias} Time</p>
                                <p className='text-xl text-[#222222]'>{orderDetails.pickup_time}</p>
                            </div>
                            <div className='text-end'>
                                <p className='text-[#444444] mb-2.5 text-right pr-1'>Order Status</p>
                                <div className='py-[5px] px-5 bg-[#FAA819] rounded-[18px] text-white' >
                                    <p>{orderDetails.status}</p>
                                </div>
                            </div>
                        </div>

                        <div className='p-5 rounded-md flex justify-between  bg-[#E8F7EC]'>
                            <div>
                                <p className='text-[#444444] mb-2.5'>Total Amount</p>
                                <p className='text-xl text-[#222222]'>৳ {orderDetails.total_price}</p>
                            </div>
                            <div className='text-end'>
                                <p className='text-[#444444] mb-2.5 text-right pr-1'>Invoice Status</p>
                                <div className='py-[5px] inline-block px-5 bg-[#03A629] rounded-[18px] text-white'>
                                    <p>{orderDetails.payment_status}</p>
                                </div>
                            </div>
                        </div>

                        <h3 className='text-xl my-[30px] text-[#222222]'>Item/Service Details</h3>

                        <div className='mb-[30px]'>
                            {orderItems.map((data, index) => (
                                <div key={index}>
                                    <div className='flex justify-between items-center mb-[15px]'>
                                        <div>
                                            <p className='text-[#222222] mb-1'>{data.quantity} x {data.name}</p>
                                            {data.addons.map((data2, index2) => (
                                                <div key={index2} className="flex">
                                                    <p className='text-[#444444] text-sm italic  ml-2'>{data2.name}</p>
                                                    <span className='mx-1'>
                                                        (</span>
                                                    {data2.items.map((data3, index3) => (
                                                        <p key={index3} className='text-[#444444] text-sm'>
                                                            {data3.name}
                                                            {(data2.items.length - 1 > index3) && ","}&nbsp;
                                                        </p>
                                                    ))}
                                                    <span className='ml-1'>)</span>
                                                </div>
                                            ))}
                                        </div>
                                        <p>৳ {data.unit_price}</p>
                                    </div>
                                </div>
                            ))}
                            <hr className='my-5 bg-[#DDDDDD]' />

                            <div className='flex justify-end text-[#222222] space-x-36'>

                                <div className='flex flex-col space-y-5'>
                                    <p>Subtotal</p>
                                    <p>Discount</p>
                                    <p>Delivery Charge</p>
                                    <p>Tax</p>
                                </div>
                                <div className='flex flex-col space-y-5 text-right'>
                                    <p>৳ {orderDetails.total_price}</p>
                                    <p>৳ {orderDetails.discount_amount}</p>
                                    <p>৳ {orderDetails.service_fee}</p>
                                    <p>৳ {orderDetails.total_vat}</p>
                                </div>
                            </div>

                        </div>

                        <h3 className='text-xl mb-2.5 text-[#222222]'>Notes</h3>

                        <p className='text-[#55585B] text-sm leading-[22px] mb-[30px]'>
                            Mobile invoicing is an easy way to bill your clients right from your mobile device so they can pay you quickly and securely. Now you can send and manage electronic invoices on your device for Free
                        </p>

                        {renderOrderInvoiceBigButton()}
                    </main>

                    {/* VERIFY OTP POPUP */}

                    {
                        (() => {
                            if (editInstruction.VerifyOtp2 === true) {
                                return (
                                    <>
                                        <Popup content={

                                            <div className="w-[470px] py-10 px-5 font-medium ">
                                                <div className="flex justify-between">
                                                    <h1 className='font-semibold leading-5 text-xl text-[#222222]'>Verify OTP</h1>
                                                    <CloseBtn className="cursor-pointer" onClick={() => closeInstructionModel("otp")} />
                                                </div>
                                                <p className='text-sm font-normal leading-5 my-5'>Please enter the 6-digit code we’ve sent to {orderDetails.user_mobile} and consumer’s order invoice</p>
                                                <form onSubmit={(event) => onSubmit(event, "otp")}>

                                                    <div className="flex items-center space-x-2 w-full container mb-5">
                                                        {otp.map((data, index) => {
                                                            return (
                                                                <span className='flex justify-center items-center' key={index}>
                                                                    <input
                                                                        type="text"
                                                                        name="otp[]"
                                                                        maxLength="1"
                                                                        key={index}
                                                                        value={data}
                                                                        className="w-[59px] h-[60px] border border-solid border-[#EEEEEE] rounded-lg text-center"
                                                                        onChange={(e) => {
                                                                            handleChange(e.target, index, "otp");
                                                                        }}
                                                                        onFocus={(e) => e.target.select()}
                                                                        required
                                                                    />
                                                                    {((index + 1) % 2 === 0 && index < (otp.length - 1)) && (<img alt="OTP Space" src={OtpSpace} className="h-[2px] w-[9px] ml-[10px] mr-0"></img>)}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                    <BlackButton name="Verify OTP" />

                                                </form>
                                            </div>

                                        }
                                        />
                                    </>
                                )
                            }

                            else if (editInstruction.VerifyRefund === true) {
                                return (
                                    <>
                                        <Popup content={

                                            <div className="w-[470px] py-10 px-5 font-medium ">
                                                <div className="flex justify-between">
                                                    <h1 className='font-semibold leading-5 text-xl text-[#222222]'>Refund</h1>
                                                    <CloseBtn className="cursor-pointer" onClick={() => closeInstructionModel("pin")} />
                                                </div>
                                                <p className='text-sm font-normal leading-5 my-5'>Please enter your 4-digit PIN</p>
                                                <form onSubmit={(event) => onSubmit(event, "pin")} >

                                                    <div className="flex items-center space-x-2 w-full container mb-5">
                                                        {pin.map((data, index) => {
                                                            return (
                                                                <span className='flex justify-center items-center' key={index}>
                                                                    <input
                                                                        type="text"
                                                                        name="pin[]"
                                                                        maxLength="1"
                                                                        key={index}
                                                                        value={data}
                                                                        className="w-[59px] h-[60px] border border-solid border-[#EEEEEE] rounded-lg text-center "
                                                                        onChange={(e) => {
                                                                            handleChange(e.target, index, "pin");
                                                                        }}
                                                                        onFocus={(e) => e.target.select()}
                                                                        required
                                                                    />
                                                                    {(index < (pin.length - 1)) && (<img alt="OTP Space" src={OtpSpace} className="h-[2px] w-[9px] ml-[10px] mr-0"></img>)}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                    <BlackButton name="Refund" />

                                                </form>
                                            </div>

                                        }
                                        />
                                    </>
                                )
                            }
                        })()
                    }
                </div >
            }
        </>
    );
};

export default OrderInvoice;