import React, { Suspense, useContext, useEffect, useState } from 'react';
import $ from "jquery";

import DatePickerV2 from "../../../components/date/DatePicker-v2";
import DatePickerRange from "../../../components/date/DatePickerRange";

import { Link, useLocation } from "react-router-dom";
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';

import { toast } from 'react-toastify';

import moment from 'moment';
import { CSVLink } from "react-csv";
import InputMask from "react-input-mask";

import UserTransactionSummeryContext from "../../../components/context/UserTransactionSummeryContext";

const filterClick = () => {
    $("#filter-toggle-icon").toggleClass("rotate-180");
    $(".custom-btn.filter").toggleClass("active");

    $("#filter-div").toggleClass("need-without-shadow");
    $("#filter-div").toggleClass("no-need-without-shadow");
}


var setDatePicker = () => {
    $("#date-div").hide();
    $("#date-range-div").hide();

    $("#fromDate, #toDate, #singleDatePicker").datepicker('setDate', null);


    var v = $("#date-range-data").val();
    if (v === "custom") {
        $("#date-range-div").show();
    }
    else if (v === "all") {
        $("#date-div").attr("style", "display:flex");
    }
}



const Transactions = () => {
    const location = useLocation();
    const UserTransactionSummery = useContext(UserTransactionSummeryContext);

    const [apiData, setApiData] = useState([]);
    const [apiDataAdditional, setApiDataAdditional] = useState("");
    const [apiLoad, setApiLoad] = useState(false);
    const [csvData, setCsvData] = useState([]);

    const [reqParam, setReqParam] = useState({
        page: 1,
        lang: "en"
    });

    const [isFilter, setIsFilter] = useState(false);

    const formatCSVData = (total_data) => {
        let from_date = $("#fromDate").val();
        let to_date = $("#toDate").val();

        console.log(from_date);

        if (from_date === undefined || from_date === null || from_date === "") {
            from_date = "N/A";
        }
        if (to_date === undefined || to_date === null || to_date === "") {
            to_date = "N/A";
        }


        let singleDatePicker = $("#singleDatePicker").val();
        if (singleDatePicker !== undefined && singleDatePicker !== null && singleDatePicker !== "") {
            from_date = singleDatePicker;
        }

        if (from_date.length > 5) {
            from_date = moment(from_date).format('DD MMM, YYYY');
        }
        if (to_date.length > 5) {
            to_date = moment(to_date).format('DD MMM, YYYY');
        }

        let other_search_option = $("#search-by-customer-name").val();

        if (other_search_option === "") {
            other_search_option = $("#search-by-transaction-id").val();
        }
        if (other_search_option === "") {
            other_search_option = $("#search-by-amount").val();
        }


        let temp = [
            ['FILTER BY'],
            ['Transaction Date(s)', from_date, to_date],
            ['Payment Method', $("#all-payment-methods option:selected").text()],
            ['Payment Status', $("#all-payment-status option:selected").text()],
            ['Other Filter', $("#other_search_option option:selected").text(), other_search_option],
            [], [],
            ['DATE', 'TIME', 'TRANSACTION ID', 'CUSTOMER / PAY TO', 'TRANSACTION TYPE', 'PAYMENT STATUS', 'AMOUNT']
        ]


        let reqParamTemp = { ...reqParam };
        reqParamTemp.per_page = total_data;

        PostLoginGetApi("user/transaction/history", reqParamTemp).then((responseJSON) => {
            var response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                var responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                // eslint-disable-next-line array-callback-return
                responseData?.["data"]?.['transactions'].map((value) => {
                    let date = moment(customDateFormat(value['created_at'])).format('DD MMM, YYYY');
                    let trx_id = value['transaction_id'];
                    let customer = value['new']['title'];
                    let status = value['title'] + ((value['type_of_tx'] === "Credit") ? " Received" : "");
                    let type = value["transaction_type"];
                    let amount = value['symbol'] + " " + value["amount"];
                    temp.push([date, value["created_at"].substring(11, 19), trx_id, customer, status, type, amount]);
                });


                setCsvData([...temp]);
            }
        }).catch((err) => {
            console.error(err);
        });
    }


    
    const [searchByCustomerName, setSearchByCustomerName] = useState("");
    useEffect(() => {
        setApiData(false);

        try {
            PostLoginGetApi("user/transaction/history", reqParam).then((responseJSON) => {
                var response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    var responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);


                    console.log(responseData["data"]);

                    setApiData(responseData["data"]);
                    formatCSVData(responseData["data_additional"]["total"]);

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

                toast.error("A problem occur. Please try again.");
            });
        }
        catch (e) {
            console.log(e.message);
        }
        finally {
            setApiLoad(true);
        }


    }, [reqParam, isFilter, location?.state]);


    // Payment Types
    const [trnxType, setTrnxType] = useState([]);
    useEffect(() => {
        try {
            PostLoginGetApi("transaction/transaction-types", { lang: null }).then((responseJSON) => {
                var response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    var responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    setTrnxType(responseData["data"]["transaction_types"]);
                    return;
                }

                toast.error("A problem occur. Please try again.");
            });
        }
        catch (e) {
            console.log(e.message);
        }
    }, []);


    // Payment Status
    const [tnrxStatus, setTrnxStatus] = useState([]);
    useEffect(() => {
        try {
            PostLoginGetApi("transaction/transaction-statuses", { lang: null }).then((responseJSON) => {
                var response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    var responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    setTrnxStatus(responseData["data"]["transaction_statuses"]);
                    return;
                }

                toast.error("A problem occur. Please try again.");
            });
        }
        catch (e) {
            console.log(e.message);
        }
    }, []);



    const setCustomFields = (val) => {
        $(".custom-search-fields").addClass("hidden");
        $(".custom-search-fields").val("");
        if (val === "") {
            return;
        }

        $("#search-by-" + val).removeClass("hidden");
        if (val === "customer-name") {
            $("#search-by-customer-name").focus();
        }
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



    const resetFilterData = () => {
        $("#date-range-data").val("custom");
        $("#fromDate, #toDate, #singleDatePicker").datepicker('setDate', null);
        $("#all-payment-methods, #all-payment-status, #search-by-transaction-id, #search-by-amount").val("");


        document.getElementById("search-by-customer-name").value = "";
        setSearchByCustomerName("");

        setDatePicker();
        filter();
        setIsFilter(false);
    }




    const filter = () => {
        // Date Filter
        var from_date = "", to_date = "";

        if ($("#date-range-data").val() === "custom") {
            from_date = $("#fromDate").val();
            to_date = $("#toDate").val();

            if (from_date.length === 0 || to_date.length === 0) {
                from_date = "";
                to_date = "";
            }
        }
        else if ($("#date-range-data").val() === "all") {
            const singleDatePicker = $("#singleDatePicker").val();
            if (singleDatePicker.length !== 0) {
                var nextDate = new Date(singleDatePicker);
                nextDate.setDate(nextDate.getDate() + 1);
                nextDate = nextDate.getFullYear() + "-" + (nextDate.getMonth() + 1) + "-" + nextDate.getDate();
                nextDate = moment(nextDate).format("YYYY-MM-DD");

                from_date = singleDatePicker;

                to_date = nextDate;
            }
        }

        // Payment Types
        let payment_types = $("#all-payment-methods").val();
        if (payment_types.length === 0) {
            payment_types = "";
        }

        // Payment Status
        let payment_status = $("#all-payment-status").val();
        if (payment_status.length === 0) {
            payment_status = "";
        }


        // Search By Custom Fields
        let search_by_custom_name = $("#search-by-customer-name").val().split(" ").join("");
        let search_by_transaction_id = $("#search-by-transaction-id").val();
        let search_by_amount = $("#search-by-amount").val();

        setReqParam({ ...reqParam, page: 1, from_date: from_date, to_date: to_date, type: payment_types, status: payment_status, id: search_by_transaction_id, tx_with: search_by_custom_name, amount: search_by_amount });

        if (from_date !== "" || to_date !== "" || payment_types !== "" || payment_status !== "" || search_by_transaction_id !== "" || search_by_custom_name !== "" || search_by_amount !== "") {
            setIsFilter(true);
        }
    }

    const customDateFormat = (date) => {
        date = date.toString();

        let day = "", month = "", year = "";
        let counter = 0;
        for (var i = 0; i < date.length; i++) {

            if (date[i] === "/" || date[i] === " ") {
                counter++;
                continue;
            }

            if (counter === 0) {
                day += date[i].toString();
            }
            else if (counter === 1) {
                month += date[i].toString();
            }
            else if (counter === 2) {
                year += date[i].toString();
            }
        }

        return month + "/" + day + "/" + year;
    }



    const renderTransactionTableData = () => {
        if (apiData?.["transactions"] === undefined) {
            return <></>;
        }

        if (apiData?.["transactions"].length === 0) {
            return (
                <tr key={0} className="border-x-2 border-b border-[#F5F5F5]">
                    <td className="py-2.5 px-5 text-center rounded-bl-md rounded-br-md " colSpan={5}>
                        No Transactions are available
                    </td>
                </tr>
            )
        }


        return apiData?.["transactions"].map((value, index) => {
            return (
                <tr key={index} className="border-x-2 border-b border-[#F5F5F5]">
                    <td className="py-2.5 px-5" title={value["created_at"]} >
                        {moment(customDateFormat(value["created_at"])).format('DD MMM, YYYY')}
                        &nbsp;<br />{value["created_at"].substring(11, 19)}
                    </td>
                    <td className="text-secondary">
                        <Link to={`/dashboard/transaction-details`} state={{ transaction: value, param: reqParam }} className='text-green-600'>{value["transaction_id"]}</Link>
                    </td>
                    <td>{value["new"]["title"]}</td>
                    <td>
                        <span className="pointer pointer-success" style={{ background: value['color'] }}></span> {value["transaction_type"]}
                    </td>
                    <td className="rounded-br-lg  text-center">{value["symbol"]} {value["amount"]}</td>
                </tr>
            )
        })

    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="custom-container w-full px-8 py-10 pt-2 pr-6 font-montserrat flex">

                {/** Left Side */}
                <div className="custom-container-left float-left custom-scroll-auto min-w-[80%] w-full mb-20 pb-[100px] pr-3 text-justify" style={{ boxShadow: "3px 0 0px 0px rgb(0 0 0 / 1%)" }}>

                    <div className="text-justify rounded-[5px] py-3">
                        <div className="w-1/2 float-left">
                            <h6 className="text-xl px-4 font-medium pb-0 pl-0">Here’s your transactions at a glance</h6>
                            <h5 className="px-4 pb-0 pl-0 pt-2 text-lg font-semibold">Today</h5>
                        </div>

                        <div className="w-1/2 h-[68px] float-left text-right justify-end flex items-center">
                            <CSVLink className="custom-btn mr-2 text-center" filename={"transaction-history.csv"} data={csvData} >Export CSV</CSVLink>
                            <Link to="#" onClick={filterClick} className="custom-btn filter text-center w-[92px]">Filter</Link>
                            <svg id="filter-toggle-icon" className='static -ml-4' width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" fill="#1A202C" />
                                <path d="M17 19L13 15L17 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="#F5F5F5" />
                            </svg>
                        </div>
                    </div>


                    <div className="w-full flex overflow-hidden text-left py-4 pt-2">
                        <div className="box hover-black-green w-[32%] py-5 h-auto mr-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                            <Link to="#" className="block text-base font-medium">
                                Transactions
                                <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>

                            <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">{UserTransactionSummery?.no_of_transaction}</h3>
                        </div>


                        <div className="box hover-black-green w-[32%] py-5 h-auto ml-[1%] mr-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                            <Link to="#" className="block text-base font-medium">
                                Total Sales
                                <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>

                            <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">৳ {UserTransactionSummery?.ecom_payment}</h3>
                        </div>

                        <div className="box hover-black-green w-[32%] py-5 h-auto ml-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                            <Link to="#" className="block text-base font-medium">
                                Total Paid
                                <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>

                            <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">৳ {UserTransactionSummery?.total_paid}</h3>
                        </div>
                    </div>

                    {/* Transactions Lists */}
                    <div>
                        {(apiLoad === true) ? (
                            <>
                                <table className="w-full custom-table-hover">
                                    <thead className='font-semibold bg-[#F5F5F5]'>
                                        <tr>
                                            <th className='rounded-t-md py-2.5 px-5'>Date & Time</th>
                                            <th>TrxID</th>
                                            <th>Customer</th>
                                            <th>Status</th>
                                            <th className='text-center rounded-tr-lg '>Amount</th>
                                        </tr>
                                        <tr></tr>
                                    </thead>
                                    <tbody>
                                        {renderTransactionTableData()}
                                    </tbody>
                                </table>


                                <p className='float-left mt-7'>
                                    {apiDataAdditional}
                                </p>

                                {(apiData?.["has_next_page"] === true) &&
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
                        ) : (
                            <p>Please wait...</p>
                        )}



                    </div>
                    {/* Transactions Lists End */}

                </div>



                {/** Right Side */}
                <div id="filter-div" className="custom-container-right float-right w-1/5 pl-2 pb-10 pt-4 pr-1 justify-center custom-scroll-auto mb-20 no-need-without-shadow">
                    <div className="relative">
                        <h6 className="text-lg px-3 font-base pb-2 pl-2" style={{ boxShadow: "0 3px 0 0 rgb(0 0 0 / 1%)" }}>Filter Transactions</h6>

                        <div className="box-full block w-full h-full text-justify py-2 pl-2 ">
                            <div className="w-full float-left pt-2">
                                <select onChange={setDatePicker} id="date-range-data" className='w-full mt-0 mb-4 bg-[#F5F5F5] rounded border-0' defaultValue="custom">
                                    <option value="all">All Day</option>
                                    <option value="custom">Custom</option>
                                </select>
                                <DatePickerV2 />
                                <DatePickerRange />
                            </div>
                        </div>

                        <div className="box-full block w-full h-full text-justify py-2 pl-2">
                            <div className="w-full float-left">
                                <select id="all-payment-methods" className='w-full mt-4 mb-4 bg-[#F5F5F5] rounded border-0'>
                                    <option value="">All Payment Methods</option>
                                    {(trnxType.length === 0) ? (
                                        <></>
                                    ) : (
                                        <>
                                            {trnxType.map(val => (
                                                <option key={val?.id} value={val?.id} >{val?.name}</option>
                                            ))}
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="box-full block w-full h-full text-justify py-2 pl-2">
                            <div className="w-full">
                                <select id="all-payment-status" className='w-full mt-0 mb-4 bg-[#F5F5F5] rounded border-0'>
                                    <option value="">All Statuses</option>
                                    {(tnrxStatus.length === 0) ? (
                                        <></>
                                    ) : (
                                        <>
                                            {tnrxStatus.map(val => (
                                                <option key={val?.identifier} value={val?.identifier} >{val?.text}</option>
                                            ))}
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="box-full flex w-[97%] h-full text-justify py-2 px-2 -mt-2 ml-2 pb-3 mb-4 bg-[#F5F5F5] rounded">
                            <div className="w-full h-full float-left">
                                <select id="other_search_option" onChange={(event) => setCustomFields(event.target.value)} className='w-full mt-0 mb-2 bg-[#F5F5F5] rounded border-0' defaultValue="customer-name">
                                    <option value="customer-name">Mobile Number</option>
                                    <option value="transaction-id">Transaction ID</option>
                                    <option value="amount">Amount</option>
                                </select>

                                <InputMask type="text" mask="+880 999 999 9999" id="search-by-customer-name" 
                                onChange={(event)=>setSearchByCustomerName(event.currentTarget.value)} value={searchByCustomerName} autoComplete='off' className="custom-search-fields w-full text-base border-0 rounded placeholder:text-ash" placeholder='Search by Mobile Number' />
                                <input type="text" id="search-by-transaction-id" placeholder='Search by Transaction ID' className='hidden custom-search-fields w-full text-base border-0 rounded placeholder:text-ash' />
                                <input type="text" id="search-by-amount" placeholder='Search by Amount' className='hidden custom-search-fields w-full text-base border-0 rounded placeholder:text-ash' />
                            </div>
                        </div>


                        <button onClick={filter} className="custom-btn w-[97%] flow-root float-left ml-2">Filter</button>

                        {isFilter && <button onClick={resetFilterData} className="custom-btn ml-2 mt-3 flow-root w-[97%] float-left bg-black text-white border-black" style={{ color: "#FFF" }}>Reset Filter</button>}
                    </div>
                </div>

            </div>
        </Suspense>
    )
}


export default Transactions;
