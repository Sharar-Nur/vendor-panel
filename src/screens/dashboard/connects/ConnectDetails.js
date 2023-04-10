import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BlackButton from '../../../components/BlackButton';
import proPic from '../../../assets/images/pro_pic.jpg'
import shareTrip from '../../../assets/images/shareTrip.jpg'
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg'
import { useEffect } from 'react';
import PostLoginPostApi from '../../../components/api/PostLoginPostApi';
import { toast } from 'react-toastify';

const ConnectDetails = () => {
    const { state } = useLocation();

    const connectDetails = state?.userData?.user;

    const connectAddress = state?.userData?.user?.address;



    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();


        const reqBody = {
            name: connectDetails.name,
            email: connectDetails.email,
            mobile_no: connectDetails.mobile_no,
            avatar: connectDetails.photo,
            deshi_user_id: connectDetails.id,
            user_type: connectDetails.user_type
        }

        //  Add a Connect
        await PostLoginPostApi("shop/connect", JSON.stringify(reqBody)).then((responseJson) => {

            let response = JSON.stringify(responseJson);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    toast.success("Connect added successfully.");
                    return navigate("/dashboard/connects");
                }

                toast.error(responseData["messages"].toString());
                return;
            }

            toast.error("A problem occur. Please try again.");
            return;

        }).catch((error) => {
            toast.error("A problem occur. Please try again.");
        });
    }


    return (
        <>

            <div className="h-full">
                <header className="p-4 border-b-2 border-dark-white mb-[60px]">
                    <Link to="/dashboard/connects/add-new"><CloseBtn className="float-left" /></Link>
                    <p className="text-center text-xl font-medium">Add New Connect</p>
                </header>
                <main className="max-w-2xl m-auto">
                    {/* Save as Connect */}

                    <div className="flex items-center justify-between border border-solid border-neutral-100 p-5 rounded" style={{ boxShadow: "0px 4px 40px rgba(0,0,0,0.05)" }}>
                        <div className="flex items-center ">
                            {/* <img src={proPic} alt="pro pic" className="rounded-full " /> */}
                            <img src={connectDetails?.photo} alt="pro pic" className="rounded-md w-[100px]" />
                            <div className="ml-5">
                                <h4 className="text-xl mb-2.5">{connectDetails?.name}</h4>
                                <p>{connectDetails?.mobile_no}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-ash mb-2.5">Account Type</p>
                            <p className="text-end">{connectDetails?.user_type}</p>
                        </div>
                    </div>

                    <div className="my-5 flow-root px-2">
                        <p className="text-ash mb-5">Recipient Info</p>
                        <div className="float-left text-secondary">
                            <p className="mb-2.5">Name</p>
                            <p className="mb-2.5">Mobile Number</p>
                            <p className="mb-2.5">Email</p>
                            <p>Shipping</p>
                        </div>
                        <div className="float-right text-end">
                            <p className="mb-2.5">{connectDetails?.name}</p>
                            <p className="mb-2.5">{connectDetails?.mobile_no}</p>
                            <p className="mb-2.5">{connectDetails?.email}</p>
                            {
                                (Array.isArray(connectAddress)) &&
                                (connectAddress.length > 0) &&
                                <p>{connectAddress[0]?.address}</p>
                            }
                        </div>
                    </div>
                    <BlackButton name="Save as Connect" onClick={handleClick} />
                </main>
            </div>
        </>
    );
};

export default ConnectDetails;