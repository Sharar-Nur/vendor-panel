/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState, useContext, useReducer } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg'
import { ReactComponent as ChecklistIcon } from '../assets/icons/checklist.svg'
import { ReactComponent as NotificationIcon } from '../assets/icons/notification.svg'
import { ReactComponent as HelpIcon } from '../assets/icons/help.svg'
import { ReactComponent as DownIcon } from '../assets/icons/down.svg'
import defaultLogo from './../assets/images/default-logo.png';
import { ReactComponent as InvoiceIcon } from '../assets/icons/invoice.svg'
import { ReactComponent as TransactionIcon } from '../assets/icons/transaction.svg'
import { ReactComponent as RightIcon } from '../assets/icons/right.svg'
import $ from "jquery";

import { Link, useNavigate } from 'react-router-dom';
import UserBasicInfoContext from './context/UserBasicInfoContext';
import PostLoginGetApi from './api/PostLoginGetApi';
import PostLoginPostApi from './api/PostLoginPostApi';
import moment from 'moment';
import { toast } from 'react-toastify'
import UserBasicInfoQRContext from './context/UserBasicInfoQRContext'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}





const apiHandlerReducer = (currentState, action) => {
    switch (action.type) {
        case "loading": {
            return {
                ...currentState,
                loading: true,
            }
        }
        case "success": {
            return {
                ...currentState,
                loading: false,
                notifications: action.data
            }
        }
        case "error": {
            return {
                ...currentState,
                loading: false,
                error: action.error
            }
        }
        default:
            return {
                ...currentState
            }

    }
}


const initialState = {
    loading: false,
    error: null,
    notifications: []
}




export default function Navbar(props) {

    const userData = useContext(UserBasicInfoContext);
    const [profile, setProfile] = useState("");

    const userBasicInfoQRData = useContext(UserBasicInfoQRContext);

    const [userBasicInfo, setUserBasicInfo] = useState('');

    const [counter, setCounter] = useState(0);


    const [notificationState, notificationDispatch] = useReducer(apiHandlerReducer, initialState);

    const navigate = useNavigate();

    useEffect(() => {
        notificationDispatch({ type: 'loading' });
        const fetchNotifications = async () => {
            let response = await PostLoginGetApi('user/notifications', "", 1)


            if (response.data.code === 200) {
                notificationDispatch({ type: 'success', data: response.data.data.notifications })
                return;
            }
            notificationDispatch({ type: 'error', error: response.data.messages })
        };
        fetchNotifications();

    }, [counter]);


    useEffect(() => {
        if (userData?.length === 0) {
            return;
        }

        setProfile(userData);
    }, [userData]);


    useEffect(() => {
        if (userBasicInfoQRData?.length === 0) {
            return;
        }
        setUserBasicInfo(userBasicInfoQRData);
    }, [userBasicInfoQRData])


    const readAll = () => {
        PostLoginPostApi('user/notification/read-all').then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    $(".notification-lists").find("p").removeClass("font-semibold");
                    $(".notification-lists").find("span").remove();


                    setCounter((prev)=>{
                        return prev+1;
                    });
                }
            }
        }).catch((err) => {
            console.log(err);
        });
    }


    const readNotification = (id) => {
        PostLoginPostApi('user/notification', JSON.stringify({ id: id })).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response['status'] === 1) {
                let responseData = JSON.stringify(response['data']);
                responseData = JSON.parse(responseData);

                if (responseData['code'] === 200) {
                    // $(".notification").addClass('opacity-75');
                    setCounter((prev)=>{
                        return prev+1;
                    });
                }
            }
        }).catch(err => {
            console.log(err);
        })
        
    }

    // $(document).on('click', '.notifications-div .notifications', function (e) {
    //     e.stopPropagation();
    // });

    const hideController = (event) => {

        // $(document).on('click', '.notifications-div .notifications', function (event) {
        //     event.stopPropagation();
        // });
        event.stopPropagation();
    }




    return (

        <div className="flex justify-end shadow-on-bottom" >
            {/* <div className="flex items-center pl-8 cursor-pointer">
                <svg onClick={toggleLeftBar} className="w-6 h-6 float-right cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>

                <span onClick={toggleLeftBar} id="page-name" className="self-center pl-3 text-2xl font-medium whitespace-nowrap dark:text-white">{props.name.toString().replace("-", " ")}</span>
            </div> */}


            <Disclosure as="nav" className="z-[1] font-normal">
                {
                    ({ open }) => (
                        <>
                            <div className="mx-auto px-2 py-3 sm:px-6 lg:px-8">
                                <div className="relative flex items-center justify-end h-16">


                                    <div className="absolute inset-y-0 right-0 flex items-center space-x-3 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                                        {/* User Guide  */}


                                        {/* Notification */}
                                        <Menu as="div" className="ml-3 relative">
                                            <div>
                                                <Menu.Button className="flex notificationButton">
                                                    <span className="sr-only">View notification</span>
                                                    <NotificationIcon />
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-[350px] rounded-md shadow-lg  bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ">
                                                    <Menu.Item className="" >
                                                        {({ active }) => (
                                                            <div  >
                                                                <header className="flex justify-between items-center py-[15px] pl-[20px] pr-[35px] bg-neutral-100" onClick={hideController}>
                                                                    <p className="font-normal">Notifications</p>
                                                                    {(notificationState?.['notifications'].length > 0) && <p className="text-sm text-[#444444] cursor-pointer font-semibold" onClick={readAll}>Mark all as read</p>}
                                                                </header>
                                                                <div className='min-h-[100px] max-h-[50vh] custom-scroll-auto ' onClick={hideController} >
                                                                    {
                                                                        notificationState?.['notifications'].length > 0 ? notificationState?.['notifications'].map((notification) => {

                                                                            //formatting date
                                                                            let date = new Date(notification.created_at);
                                                                            let day = date.getDate();
                                                                            let monthAndYear = date.toLocaleString('en-us', { month: 'short', year: 'numeric' }).split(' ').join(', ');
                                                                            let time = moment(notification["created_at"].toString().substring(9)).format('hh:mm A');

                                                                            return (

                                                                                <div className="py-[15px] pl-[20px] flex items-center justify-center border-solid border-b-2 border-neutral-100 gap-x-2.5 cursor-pointer hover:bg-[#f5f5f5]" key={notification.id} onClick={() => readNotification(notification?.id)}>



                                                                                    {/* img */}



                                                                                    <div className="w-full notification">
                                                                                        <div>

                                                                                            {notification.read_at === null ?

                                                                                                <div className='flex mb-2.5 notification-lists items-center'>
                                                                                                    <span className='pointer sm pointer-success'></span>
                                                                                                    <p className="font-semibold pr-2">{notification.title} </p>
                                                                                                </div> : <p className="mb-2.5 notification-lists">{notification.title}</p>}
                                                                                        </div>
                                                                                        <div className='flex'>
                                                                                            <div className="p-3.5 bg-neutral-100 h-[50px] w-[50px]">
                                                                                                {/* <InvoiceIcon /> */}
                                                                                                <img src={notification.icon} alt="notification icon" />
                                                                                            </div>
                                                                                            <div className='ml-4'>
                                                                                                <div className='text-sm'>{notification.sub_title.substring(0, 28) + "..."}</div>
                                                                                                {/* <div className='text-sm'>{notification?.sub_title}</div> */}

                                                                                                <div className='mt-1'>
                                                                                                    <span className="text-[#999999] text-sm">{day} {monthAndYear}</span>
                                                                                                    <span className="float-right text-[#999999] text-sm mt-1">{time}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            )
                                                                        }) : <p className='mt-5 ml-5'>You have no notification</p>
                                                                    }
                                                                </div>


                                                                {notificationState?.['notifications'].length > 0 &&
                                                                    <footer className="text-center py-[15px] px-[30px] font-medium bg-neutral-100 cursor-pointer" onClick={() => navigate("/dashboard/notifications")}>
                                                                        See All Notifications
                                                                    </footer>
                                                                }
                                                            </div>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>



                                        {/* Profile dropdown */}
                                        <div className="flex items-center justify-center ">
                                            <img
                                                className=" rounded-full w-[50px] h-[50px] object-cover"
                                                src={(userBasicInfo.business_info?.bussiness_logo) ? userBasicInfo.business_info?.bussiness_logo : defaultLogo}
                                                alt="Business Logo"
                                            />
                                            <Menu as="div" className="ml-2 relative">
                                                <div>
                                                    <Menu.Button className="flex ">
                                                        <p className="font-medium px-2">
                                                            {(userBasicInfo.business_info?.bussiness_name === null || userBasicInfo.business_info?.bussiness_name === "") ? userBasicInfo.user?.name : userBasicInfo.business_info?.bussiness_name}
                                                        </p>
                                                        <span className="sr-only">Open user menu</span>
                                                        <DownIcon />
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        {/* <Menu.Item>
                                                            {({ active }) => (
                                                                <Link to={"/dashboard/account-settings"} className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                                                                    Your Profile
                                                                </Link>
                                                            )}

                                                        </Menu.Item>
                                                        {/* <Menu.Item>

                                                        </Menu.Item> */}
                                                        <Menu.Item>

                                                            {({ active }) => (
                                                                <Link to="/dashboard/account-settings" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                                                                    Settings
                                                                </Link>
                                                            )}
                                                        </Menu.Item>

                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <Link to={'/dashboard/logout'} className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                                                                    Sign out
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </Disclosure>

        </div>
    )
}
