import { useEffect, useReducer, useState } from "react";
import PostLoginGetApi from "../../../components/api/PostLoginGetApi";
import moment from 'moment';
import PostLoginPostApi from "../../../components/api/PostLoginPostApi";
import $ from 'jquery'

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


const AllNotificationsTest = () => {

    const [notificationState, notificationDispatch] = useReducer(apiHandlerReducer, initialState);
    const [flag, setFlag] = useState('');




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

    }, [])

    const readNotification = (id) => {
        PostLoginPostApi('user/notification', JSON.stringify({ id: id })).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response['status'] === 1) {
                let responseData = JSON.stringify(response['data']);
                responseData = JSON.parse(responseData);

                if (responseData['code'] === 200) {
                    // $(`#${id}`).addClass('opacity-75');
                }
            }
        }).catch(err => {
            console.log(err);
        })
    }



    const handleAll = () => {

        $(".notification-all-btn").addClass('active')
        $(".notification-unread-btn").removeClass('active');
        setFlag('all');

        // return (
        //     <div className='w-full h-[100vh] custom-scroll-auto mt-5' >
        //     {
        //         notificationState?.['notifications'].length > 0 ? notificationState?.['notifications'].map((notification) => {

        //             //formatting date
        //             let date = new Date(notification.created_at);
        //             let day = date.getDate();
        //             let monthAndYear = date.toLocaleString('en-us', { month: 'short', year: 'numeric' }).split(' ').join(', ');
        //             let time = moment(notification["created_at"].toString().substring(9)).format('hh:mm A');

        //             return (

        //                 <div className="py-[15px] pl-[20px] flex items-center justify-center border-solid border-b-2 border-neutral-100 gap-x-2.5 cursor-pointer hover:bg-[#f5f5f5]" key={notification.id} onClick={() => readNotification(notification?.id)}>



        //                     {/* img */}



        //                     <div className="w-full notification" id={notification?.id}>
        //                         <div>

        //                             {notification?.read_at === null ?

        //                                 <div className='flex mb-2.5 notification-lists items-center'>
        //                                     <span className='pointer sm pointer-success hidden'></span>
        //                                     <p className="font-semibold pr-2">{notification.title} </p>
        //                                 </div> : <p className="mb-2.5 notification-lists">{notification.title}</p>}
        //                         </div>
        //                         <div className='flex'>
        //                             <div className="p-3.5 bg-neutral-100 h-[50px] w-[50px]">
        //                                 {/* <InvoiceIcon /> */}
        //                                 <img src={notification.icon} alt="notification icon" />
        //                             </div>
        //                             <div className='ml-4'>
        //                                 {/* <div className='text-sm'>{notification.sub_title.substring(0, 28) + "..."}</div> */}
        //                                 <div className='text-sm'>{notification?.sub_title}</div>

        //                                 <div className='mt-1'>
        //                                     <span className="text-[#999999] text-sm">{day} {monthAndYear}</span>
        //                                     <span className="float-right text-[#999999] text-sm mt-1">{time}</span>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>

        //             )
        //         }) : <p>You have no notification yet</p>
        //     }
        // </div>
        // )
    }

    const handleUnread = () => {

        $(".notification-all-btn").removeClass('active')
        $(".notification-unread-btn").addClass('active');
        setFlag('unread');
    }


    const displayNotiication = () => {
        if(flag === "all"){
            return (
                <div className='w-full h-[100vh] custom-scroll-auto mt-5' >
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
    
    
    
                                <div className="w-full notification" id={notification?.id}>
                                    <div>
    
                                        {notification?.read_at === null ?
    
                                            <div className='flex mb-2.5 notification-lists items-center'>
                                                <span className='pointer sm pointer-success hidden'></span>
                                                <p className="font-semibold pr-2">{notification.title} </p>
                                            </div> : <p className="mb-2.5 notification-lists">{notification.title}</p>}
                                    </div>
                                    <div className='flex'>
                                        <div className="p-3.5 bg-neutral-100 h-[50px] w-[50px]">
                                            {/* <InvoiceIcon /> */}
                                            <img src={notification.icon} alt="notification icon" />
                                        </div>
                                        <div className='ml-4'>
                                            {/* <div className='text-sm'>{notification.sub_title.substring(0, 28) + "..."}</div> */}
                                            <div className='text-sm'>{notification?.sub_title}</div>
    
                                            <div className='mt-1'>
                                                <span className="text-[#999999] text-sm">{day} {monthAndYear}</span>
                                                <span className="float-right text-[#999999] text-sm mt-1">{time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
    
                        )
                    }) : <p>You have no notification yet</p>
                }
            </div>
            )
        }
        else if (flag === "unread"){
            return (
                <div className='w-full h-[100vh] custom-scroll-auto mt-5' >
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
    
    
    
                                <div className="w-full notification" id={notification?.id}>
                                    <div>
    
                                        {notification?.read_at === null ?
    
                                            <div className='flex mb-2.5 notification-lists items-center'>
                                                <span className='pointer sm pointer-success hidden'></span>
                                                <p className="font-semibold pr-2">{notification.title} </p>
                                            </div> : <p className="mb-2.5 notification-lists">{notification.title}</p>}
                                    </div>
                                    <div className='flex'>
                                        <div className="p-3.5 bg-neutral-100 h-[50px] w-[50px]">
                                            {/* <InvoiceIcon /> */}
                                            <img src={notification.icon} alt="notification icon" />
                                        </div>
                                        <div className='ml-4'>
                                            {/* <div className='text-sm'>{notification.sub_title.substring(0, 28) + "..."}</div> */}
                                            <div className='text-sm'>{notification?.sub_title}</div>
    
                                            <div className='mt-1'>
                                                <span className="text-[#999999] text-sm">{day} {monthAndYear}</span>
                                                <span className="float-right text-[#999999] text-sm mt-1">{time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
    
                        )
                    }) : <p>You have no notification yet</p>
                }
            </div>
            )
        }
    }



    return (
        <div className="custom-container w-full  py-10 pt-2 pr-6 font-montserrat">
            <div className="flex">
                <button className="px-5 py-2 border-1 border-black rounded m-5  notification-all-btn active" onClick={handleAll}>All Notifications</button>
                <button className="px-5 py-2 border-1 border-black rounded m-5  notification-unread-btn"  onClick={handleUnread}>UnRead</button>
            </div>
            {/* <div className="notification-list-div origin-top-right absolute right-0 mt-2  rounded-md shadow-lg  bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"  > */}
            {/* <h1 className="mx-auto text-center border-b-1 border-b-black">All Notifications </h1> */}
            
            <div className='w-full h-[100vh] custom-scroll-auto mt-5' >
                {displayNotiication()}
            </div>

            {/* </div> */}

        </div>

    )
}

export default AllNotificationsTest;
