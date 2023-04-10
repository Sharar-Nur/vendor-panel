import React, { useEffect, useState, useContext, Suspense } from "react";
import DonutChart from "./../../../components/charts/DonutChart";
import PostLoginGetApi from "../../../components/api/PostLoginGetApi";
import { Link } from "react-router-dom";
import $ from "jquery";

// Context
import UserTransactionSummeryContext from "../../../components/context/UserTransactionSummeryContext";


// QR Code
const QRCode = React.lazy(() => { return import("qrcode.react") });



const HomeComplete = () => {


    const transactionSummery = useContext(UserTransactionSummeryContext);
    const [transactionSummeryData, setTransactionSummeryData] = useState({});

    const [balance, setBalance] = useState({
        accountNumber: "",
        currency: "",
        balance: ""
    });

    const [todayBalanceSummary, setTodayBalanceSummary] = useState({
        receivable: "",
        withdraw: "",
        amount: ""
    });

    const [balanceSummary, setBalanceSummary] = useState({
        withdrawn: "",
        refund: "",
        received_payment: "",
        payment_qty: "",
    });

    var [refresh, setRefresh] = useState(0);

    // Refresh Icon Click Event
    const refreshIconClick = (event) => {
        $("#top-balance").find("div").hide();
        $("#top-balance>.loading").show();
        setRefresh((previousState) => {
            return refresh = previousState + 1;
        });
    }


    useEffect(() => {
        setTransactionSummeryData(transactionSummery);
    }, [transactionSummery]);



    useEffect(() => {

        setTimeout(() => {
            $("#top-balance").find("div").show();
            $("#top-balance>.loading").hide();
        }, 500);


        PostLoginGetApi("user/balances").then((responseJSON) => {
            var response = JSON.stringify(responseJSON);
            response = JSON.parse(response);
            if (response["status"] === 1) {
                var responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);
                if (responseData["code"] === 200) {
                    let data = JSON.stringify(responseData["data"]);
                    data = JSON.parse(data);


                    if (data["balances"][0]["is_active"] === 1) {
                        setBalance({ accountNumber: data["balances"][0]["account_no"], currency: data["balances"][0]["currency"], balance: data["balances"][0]["balance"].substring(1) });
                    }

                    setTodayBalanceSummary({ receivable: data["todays_received_payments"], withdraw: data["todays_withdraw"], amount: parseFloat(data["todays_received_payments"]["amount"] - data["todays_withdraw"]["amount"]) });
                    setBalanceSummary({ withdrawn: data["summary"]["withdrawn"], refund: data["summary"]["refund"], received_payment: data["summary"]["received_payment"], payment_qty: data["summary"]["payment_qty"] });
                }
            }
        });

    }, [refresh]);


    return (
        <>
            {/** First Div --- SUMMARY */}
            <div id="top-balance" className="box-full w-full h-[159px] bg-[#F5F5F5] text-[#222222] p-6 px-8 text-justify rounded-[5px]">
                <p className="font-medium text-base px-4 pb-4 pl-0 pr-0">
                    Account No. {balance && balance.accountNumber}

                    <span onClick={refreshIconClick} className="refresh-icon-svg float-right cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.55 21.67C18.84 20.54 22 16.64 22 12C22 6.48 17.56 2 12 2C5.33 2 2 7.56 2 7.56M2 7.56V3M2 7.56H4.01H6.44" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12C2 17.52 6.48 22 12 22" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" />
                        </svg>
                    </span>
                </p>
                <hr style={{ "border": "1px solid #DDDDDD", "borderRadius": "5px" }} />

                <div className="w-2/3 float-left">
                    <p className="font-normal text-base px-4 pb-0 pl-0 pt-4 mb-2.5">Account Balance</p>
                    <h2 style={{ "fontSize": "24px", "fontWeight": "600", "marginTop": "-4px" }} className="font-bold px-4 pl-0 pt-0">{balance && balance.balance} {balance && balance.currency}</h2>
                </div>

                <div className="loading w-2/3 pt-4 font-semibold float-left hidden">
                    loading...
                </div>

            </div>


            {/* <h6 className="mt-7 text-xl font-medium">Here’s your business at a glance</h6>
            <h5 className="pt-3 pb-2 text-lg font-semibold">Today</h5>

            <div className="w-full flex overflow-hidden text-left ">

                <div className="flex items-center box hover-black-green w-[50%] mr-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] py-5 pl-5 pr-5">
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2513_20291)">
                            <path d="M27.7657 13C28.2813 13.2012 28.4347 13.5865 28.4335 14.124C28.4228 21.4105 28.4259 28.697 28.4259 35.9835C28.4259 36.5398 28.1857 36.8824 27.728 36.9723C27.6292 36.9918 27.5261 36.9912 27.4249 36.9918C25.8077 36.9931 24.1911 36.9931 22.5738 36.9925C21.8985 36.9918 21.5741 36.6643 21.5741 35.9829C21.5735 28.6964 21.5772 21.4099 21.5665 14.1234C21.5653 13.5853 21.7187 13.2005 22.2343 13C24.0779 13 25.9221 13 27.7657 13Z" fill="#DDDDDD" />
                            <path d="M13 23.0757C13.2157 22.5577 13.6162 22.4069 14.157 22.4144C15.7182 22.4358 17.2808 22.4213 18.8426 22.422C19.5268 22.422 19.8544 22.7438 19.8544 23.4196C19.855 27.612 19.855 31.805 19.8544 35.9973C19.8544 36.665 19.528 36.9918 18.8647 36.9925C17.287 36.9937 15.7094 36.9805 14.1324 37C13.5992 37.0063 13.2062 36.8529 13.0006 36.3387C13 31.9175 13 27.4963 13 23.0757Z" fill="#DDDDDD" />
                            <path d="M30.1456 28.411C30.1456 25.9122 30.1588 23.4133 30.1375 20.9145C30.1305 20.1325 30.599 19.8364 31.2095 19.8433C32.7947 19.8622 34.3805 19.8496 35.9663 19.8502C36.6718 19.8502 36.9994 20.1771 36.9994 20.8799C36.9994 25.909 36.9994 30.9381 36.9994 35.9665C36.9994 36.67 36.6743 36.9925 35.9663 36.9931C34.3648 36.9937 32.7639 36.9937 31.1624 36.9931C30.4644 36.9931 30.1456 36.675 30.145 35.9778C30.145 33.4551 30.1456 30.9331 30.1456 28.411Z" fill="#DDDDDD" />
                        </g>
                        <rect x="0.5" y="0.5" width="49" height="49" rx="4.5" stroke="#DDDDDD" />
                        <defs>
                            <clipPath id="clip0_2513_20291">
                                <rect width="24" height="24" fill="white" transform="translate(13 13)" />
                            </clipPath>
                        </defs>
                    </svg>

                    <div className="block px-4">
                        <Link to="#" className="block text-base font-medium">
                            Account Balance
                            <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>

                        {transactionSummeryData.payment_received > 0 ? <h3 style={{ "fontSize": "20px" }} className="font-semibold">৳ {transactionSummeryData.payment_received}</h3> : <h3 style={{ "fontSize": "20px" }} className="text-[#999999] opacity-70 font-semibold ">No sales yet today</h3>}
                    </div>
                </div>


                <div className="flex items-center box hover-black-green w-[50%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] py-5 pl-5 pr-5">
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2513_20303)">
                            <path d="M33.2929 21.7282C32.9332 21.3758 32.6436 21.0953 32.3586 20.8112C31.8514 20.3067 31.3433 19.8023 30.8415 19.2932C30.3635 18.8088 30.3398 18.1604 30.776 17.7115C31.2213 17.2525 31.8887 17.2653 32.3823 17.7561C33.7983 19.1666 35.2097 20.5817 36.623 21.995C36.9781 22.3501 37.1065 22.7672 36.9062 23.238C36.7077 23.706 36.3261 23.9109 35.8216 23.9109C30.0648 23.91 24.307 23.9109 18.5501 23.9091C17.859 23.9091 17.3663 23.4483 17.3672 22.8182C17.3682 22.1844 17.8562 21.73 18.551 21.73C23.309 21.7282 28.0669 21.7291 32.8248 21.7291C32.945 21.7282 33.0652 21.7282 33.2929 21.7282Z" fill="#DDDDDD" />
                            <path d="M16.748 28.2718C16.8719 28.4057 16.9438 28.4885 17.0203 28.565C17.7342 29.2798 18.4527 29.991 19.1621 30.7104C19.6374 31.1921 19.6556 31.8478 19.2185 32.293C18.7705 32.7484 18.1067 32.7311 17.6122 32.2384C16.2044 30.8361 14.8021 29.4283 13.3952 28.025C13.0309 27.6617 12.8862 27.2419 13.0956 26.7575C13.3032 26.2758 13.7011 26.0882 14.2165 26.0882C19.9616 26.0918 25.7066 26.09 31.4526 26.0909C32.1419 26.0909 32.6345 26.5535 32.6318 27.1845C32.6291 27.8156 32.1382 28.27 31.4434 28.27C26.6864 28.2718 21.9285 28.2709 17.1715 28.2709C17.0531 28.2718 16.9338 28.2718 16.748 28.2718Z" fill="#DDDDDD" />
                        </g>
                        <rect x="0.5" y="0.5" width="49" height="49" rx="4.5" stroke="#DDDDDD" />
                        <defs>
                            <clipPath id="clip0_2513_20303">
                                <rect width="24" height="15.2454" fill="white" transform="translate(13 17.3773)" />
                            </clipPath>
                        </defs>
                    </svg>

                    <div className="block px-4 mt-0">
                        <Link to="/dashboard/transactions" className="block text-base font-medium">
                            Transaction
                            <svg style={{ "display": "revert" }} className="ml-1" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>

                        {transactionSummeryData.no_of_transaction > 0 ? <h3 style={{ "fontSize": "20px" }} className="font-semibold">{transactionSummeryData.no_of_transaction}</h3> : <h3 style={{ "fontSize": "20px" }} className="text-[#999999] font-semibold  opacity-70">No transaction yet today</h3>}
                    </div>
                </div>

            </div> */}

            {/* <div className="mt-5 flex box w-full min-h-[200px] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] pt-5 pl-5 pr-5">

                <div className="w-4/5 color-#222222">
                    <Link to="#" className="block pt-2 pb-1 font-medium w-full">
                        Payment Types
                        <svg className="display-revert ml-1" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>

                    <table id="payment-types-table" className="custom-border-top table-auto w-full m-auto h-auto mt-2" border={1}>
                        <tbody>
                            <tr id="inv-pay-data">
                                <td className="mt-2 pt-4 pb-4 rounded-l-md pl-4">
                                    <span className="pointer pointer-success"></span>
                                    EComm Payment
                                </td>
                                <td className="mt-2 pt-4 pb-4 rounded-r-md text-center font-semibold text-xl">
                                    ৳ {transactionSummeryData.ecom_payment}
                                </td>
                            </tr>
                            <tr className="custom-border-top" id="qr-pay-data">
                                <td className="mt-2 pt-4 pb-4 rounded-l-md pl-4">
                                    <span className="pointer pointer-success-dark"></span>
                                    QR Offline
                                </td>
                                <td className="mt-2 pt-4 pb-4 rounded-r-md text-center font-semibold text-xl">৳ {transactionSummeryData.qr_offline}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>


                <div className="relative w-1/5 text-center chart-div-right -mt-4 -right-4">
                    {(transactionSummeryData.length === 0) ? "Loading.." : <DonutChart props={transactionSummeryData} />}
                </div>

            </div> */}

        </>
    );
}



export default HomeComplete;