import React, { Suspense, useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import $ from "jquery";
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';


// Import
import OnlineCounter from './online-counter';
import OfflineCounter from './offline-counter';




export default function Counter() {

    const { state } = useLocation();


    const [addStoreLink, setAddStoreLink] = useState("create");
    const [currentTab, setCurrentTab] = useState("view-online-store");

    const handleTab = (tabId, event) => {
        $(".tablinks").removeClass("current");
        $(event.target).addClass("current");
        setCurrentTab(tabId);

        if (tabId === "view-online-store") {
            setAddStoreLink("create");
        }
        else if (tabId === "view-offline-store") {
            setAddStoreLink("offline/create");
        }
    }

    const filterClick = () => {
        $("#filter-toggle-icon").toggleClass("rotate-180");
        $(".custom-btn.filter").toggleClass("active");

        $("#filter-div").toggleClass("need-without-shadow");
        $("#filter-div").toggleClass("no-need-without-shadow");
    }

    const [isOnlineLoadData, setIsOnlineLoadData] = useState(false);
    const [onlineShopList, setOnlineShopList] = useState([]);

    const [isOfflineLoadData, setIsOfflineLoadData] = useState(false);
    const [offlineShopList, setOfflineShopList] = useState([]);

    const [reqParam, setReqParam] = useState({
        page: 1,
        lang: "en"
    });

    useEffect(() => {
        if (state?.tab !== null && state?.tab !== undefined && state?.tab !== "") {
            if (state?.tab === "view-offline-store") {
                $(".tablinks").eq(1).trigger("click");
            }
        }
    }, [state]);

    const [apiDataAdditional, setApiDataAdditional] = useState("");



    const [onlineDataAdditional, setOnlineDataAdditional] = useState({});


    // CALL THE LIST ONLINE STORE LIST API
    useEffect(() => {
        PostLoginGetApi("user/store/store-configuration", reqParam).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);


                if (responseData["code"] === 200) {
                    setOnlineShopList(responseData["data"]);
                }

                setOnlineDataAdditional(responseData["data_additional"]);

                let start_point = ((reqParam.page - 1) * responseData["data_additional"]["per_page"]) + 1;
                let end_point = reqParam.page * responseData["data_additional"]["per_page"];
                if (end_point > responseData["data_additional"]["total"]) {
                    end_point = responseData["data_additional"]["total"];
                }


                if (responseData["data_additional"]["total"] > 0) {
                    setApiDataAdditional(`Showing ${start_point} - ${end_point} out of ${responseData["data_additional"]["total"]}`);
                }
                else {
                    setApiDataAdditional("");
                }

                return;
            }
        }).catch((exception) => {
            console.log(exception);
        }).finally(() => {
            setIsOnlineLoadData(true);
        });

    }, [reqParam]);

    const [offlineDataAdditional, setOfflineDataAdditional] = useState({});
    const [offlineApiDataAdditional, setOfflineApiDataAdditional] = useState("");
    // CALL THE LIST OFFLINE STORE LIST API
    useEffect(() => {
        PostLoginGetApi("user/store/offline/store-configuration", reqParam).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    setOfflineShopList(responseData["data"]);
                }

                setOfflineDataAdditional(responseData["data_additional"]);

                let start_point = ((reqParam.page - 1) * responseData["data_additional"]["per_page"]) + 1;
                let end_point = reqParam.page * responseData["data_additional"]["per_page"];
                if (end_point > responseData["data_additional"]["total"]) {
                    end_point = responseData["data_additional"]["total"];
                }


                if (responseData["data_additional"]["total"] > 0) {
                    setOfflineApiDataAdditional(`Showing ${start_point} - ${end_point} out of ${responseData["data_additional"]["total"]}`);
                }
                else {
                    setOfflineApiDataAdditional("");
                }

                return;
            }
        }).catch((exception) => {
            console.log(exception);
        }).finally(() => {
            setIsOfflineLoadData(true);
        });
    }, [reqParam]);


    const inputHandler = (event) => {
        console.log(event.target.name + " : " + event.target.value);
    }

    const pagination = (next = 1) => {
        if (next === 1) {
            setReqParam({ ...reqParam, page: reqParam.page + 1 });
            return;
        }

        if (reqParam.page > 1) {
            setReqParam({ ...reqParam, page: reqParam.page - 1 });
            return;
        }

        setReqParam({ ...reqParam, page: 1 });
        return;
    }

    // Online Counter
    const [isNextButton, setIsNextButton] = useState(false);
    useEffect(() => {
        let currentLastData = Math.min(reqParam.page * onlineDataAdditional.per_page, onlineDataAdditional.total);
        if (currentLastData < onlineDataAdditional.total) {
            setIsNextButton(true);
        }

    }, [reqParam, onlineShopList, onlineDataAdditional]);


    // Online Counter
    const [isOfflineNextButton, setIsOfflineNextButton] = useState(false);
    useEffect(() => {
        let currentLastData = Math.min(reqParam.page * offlineDataAdditional.per_page, offlineDataAdditional.total);
        if (currentLastData < offlineDataAdditional.total) {
            setIsOfflineNextButton(true);
        }

    }, [reqParam, offlineShopList, offlineDataAdditional]);


    return (
        <div className="custom-container w-full float-left px-8 py-10 pt-4 block font-montserrat custom-scroll-auto mb-20">

            {/* <div className="custom-container w-full font-montserrat flex"> */}

            {/** Left Side */}
            {/* <div className="custom-container-left float-left custom-scroll-auto min-w-[80%] w-full pr-3 pb-20 text-justify" style={{ boxShadow: "3px 0 0px 0px rgb(0 0 0 / 1%)" }}> */}

            <div className="text-justify rounded-[5px] py-3">
                <div className="w-1/2 float-left">
                    <h6 className="text-2xl px-4 font-medium pb-0 pl-0 pt-4">Here’s your counters at a glance</h6>
                </div>

                <div className="w-1/2 h-[68px] float-left text-right justify-end flex items-center">
                    <Link to={addStoreLink} className="custom-btn mr-0 text-center">Add New Counter</Link>

                    {/* <Link to="#" onClick={filterClick} className="custom-btn active filter text-center w-[92px]">Filter</Link>
                            <svg id="filter-toggle-icon" className='static -ml-4' width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" fill="#1A202C" />
                                <path d="M17 19L13 15L17 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="#F5F5F5" />
                            </svg> */}
                </div>
            </div>


            <div className="w-full flex overflow-hidden text-left py-4 pt-2">
                <div className="box hover-black-green w-[32%] py-5 h-auto mr-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                    <Link to="#" className="block text-base font-medium">
                        Online Counters
                        <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>

                    <h3 style={{ fontSize: "22px" }} className="font-semibold  opacity-70">{onlineShopList?.length}</h3>
                </div>


                <div className="box hover-black-green w-[32%] py-5 h-auto ml-[1%] mr-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                    <Link to="#" className="block text-base font-medium">
                        Offline Counters
                        <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>

                    <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">{offlineShopList?.length}</h3>
                </div>

                <div className="box hover-black-green w-[32%] py-5 h-auto ml-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                    <Link to="#" className="block text-base font-medium">
                        Total Counters
                        <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>

                    <h3 style={{ fontSize: "22px" }} className="font-semibold  opacity-70">{parseInt(onlineShopList?.length) + parseInt(offlineShopList?.length)}</h3>
                </div>
            </div>



            {/* TAB SWITCHER */}
            <div className="tab w-full">
                <button className="tablinks current" onClick={(event) => handleTab("view-online-store", event)}>Online Counter</button>
                <button className="tablinks" onClick={(event) => handleTab("view-offline-store", event)}>Offline Counter</button>
            </div>

            <div className='tabcontentbody py-3 px-0'>
                <div id="view-profile" className="tabcontent" style={{ display: "block", paddingLeft: "0px", paddingRight: "0px" }}>
                    <Suspense fallback="Loading...">

                        {(() => {
                            switch (currentTab) {
                                case "view-online-store":
                                    return (isOnlineLoadData?.online === false) ? <p className='p-3'>Loading...</p> : <OnlineCounter shops={onlineShopList} setReqParam={setReqParam} reqParam={reqParam}></OnlineCounter>
                                case "view-offline-store":
                                    return (isOfflineLoadData?.offline === false) ? <p className='p-3'>Loading...</p> : <OfflineCounter shops={offlineShopList} setReqParam={setReqParam} reqParam={reqParam}></OfflineCounter>
                                default:
                                    return <h1>Sorry ! No page found.</h1>
                            }

                        })()}

                        {(currentTab === "view-online-store") &&
                            <>
                                <p className='float-left mt-7'>
                                    {apiDataAdditional}
                                </p>

                                {(isNextButton === true) &&
                                    <button onClick={() => pagination(1)} className="custom-btn float-right mt-5">
                                        Next Page&nbsp;&nbsp;&rarr;
                                    </button>
                                }

                                {(reqParam.page > 1) &&
                                    <button onClick={() => pagination(0)} className="custom-btn float-right mt-5 mr-2">
                                        &larr;&nbsp;&nbsp;Previous Page
                                    </button>
                                }
                            </>
                        }

                        {(currentTab === "view-offline-store") &&
                            <>
                                <p className='float-left mt-7'>
                                    {offlineApiDataAdditional}
                                </p>

                                {(isOfflineNextButton === true) &&
                                    <button onClick={() => pagination(1)} className="custom-btn float-right mt-5">
                                        Next Page&nbsp;&nbsp;&rarr;
                                    </button>
                                }

                                {(reqParam.page > 1) &&
                                    <button onClick={() => pagination(0)} className="custom-btn float-right mt-5 mr-2">
                                        &larr;&nbsp;&nbsp;Previous Page
                                    </button>
                                }
                            </>
                        }


                    </Suspense>
                </div>
            </div>

            {/* </div> */}



            {/** Right Side */}
            {/* <div id="filter-div" className="custom-container-right float-right w-1/5 pl-2 pb-10 pt-4 pr-1 justify-center custom-scroll-auto mb-20 need-without-shadow">
                    <div className="relative float-right w-full">
                        <h6 className="text-lg font-base pb-2 pl-2" style={{ boxShadow: "0 3px 0 0 rgb(0 0 0 / 1%)" }}>Filter Store</h6>

                        <div className="box-full block w-full h-full text-justify py-2 pl-2 mt-2">
                            <div className="w-full">
                                <select id="categories" name="category" onChange={(event) => inputHandler(event)} className='w-full mt-0 mb-2 bg-[#F5F5F5] rounded border-0'>
                                    <option value="" disabled >Choose</option>
                                    <option value="online">Online Store</option>
                                    <option value="offline">Offline Store</option>
                                </select>
                            </div>
                        </div>

                        <div className="box-full flex w-[97%] h-full text-justify py-2 px-2 ml-2 pb-3 mb-4 bg-[#F5F5F5] rounded">
                            <div className="w-full h-full float-left">
                                <select id="searchBy" name="searchBy" onChange={(event) => inputHandler(event)} className='w-full mt-0 mb-2 bg-[#F5F5F5] rounded border-0' defaultValue="customer-name">
                                    <option value="customer-name">Search by Name</option>
                                </select>

                                <input type="text" id="searchByName" onChange={(event) => inputHandler(event)} name="searchByName" placeholder='Search by name' className='w-full p-[10px] border-[1px] border-[#F5F5F5] rounded-[5px] text-[14px] bg-white text-[#222222] h-[40px]  mt-[5px]' />
                            </div>
                        </div>
                    </div>
                </div> */}

            {/* </div> */}


            <style>{`
            .custom-scroll-auto { 
                overflow-x: hidden;
            }

            .tab button:hover::after, .tab button.current::after { 
                width: 125% !important;
            }
            `}</style>


        </div >
    )

}