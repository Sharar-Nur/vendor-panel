import React, { Suspense, useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import TransferButton from './transferButton';

import PostLoginGetApi from './../../../components/api/PostLoginGetApi';
import PostLoginPostApi from './../../../components/api/PostLoginPostApi';

import $ from "jquery";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AccountBalanceContext from '../../../components/context/AccountBalanceContext';
import UserBasicInfoContext from '../../../components/context/UserBasicInfoContext';
import RootContext from '../../../components/context/RootContext';


function Transfer() {

    const accountBalance = useContext(AccountBalanceContext);
    const UserBasicInfo = useContext(UserBasicInfoContext);
    const rootContextValue = useContext(RootContext);

    const { state } = useLocation();
    const navigate = useNavigate();

    const [accNumber, setAccNumber] = useState('')
    const [isBeneficiaryAdd, setIsBeneficiaryAdd] = useState(false);

    const [inputs, setInputs] = useState({
        accName: "",
        accNumber: ""
    })
    const [bank, setBank] = useState('');
    const [branch, setBranch] = useState('');

    const [beneficiaryList, setBeneficiaryList] = useState([]);
    const [bankList, setBankList] = useState([]);
    const [bankBranchList, setBankBranchList] = useState([]);
    const [inactiveAccount, setInactiveAccount] = useState([]);
    const [inactiveModal, setInactiveModal] = useState({
        isShow: false,
        id: ""
    });
    const [isRefresh, setIsRefresh] = useState(0);







    const addBeneficiary = () => {
        $("#filter-toggle-icon").toggleClass("rotate-180");
        $(".custom-btn.filter").toggleClass("active");

        $("#filter-div").toggleClass("need-without-shadow");
        $("#filter-div").toggleClass("no-need-without-shadow");

        $("#bank_name, #branch_name").val("");
        setInputs({ ...inputs, accNumber: "" });
    }

    // Get all bank lists
    useEffect(() => {
        setIsBeneficiaryAdd(false);

        // Check page access is valid or not
        if (state !== null && state.successTransfer !== null && state.successTransfer !== "") {
            toast.success(state.successTransfer);
            window.history.replaceState({}, "");

            setTimeout(() => {
                rootContextValue.forceUpdate("transfer");
            }, 2000);

        }

        try {
            PostLoginGetApi("banks").then((responseJSON) => {
                var response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    var responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    setBankList(responseData["data"]["banks"]);
                    return;
                }
            }).catch((error) => {
                // toast.error("A problem occur. Please try again.");
                console.log(error);
            });
        }
        catch (exception) {
            toast.error("A problem occur.");
            console.log(exception);
        }
    }, []);


    // Get all bank lists
    useEffect(() => {
        try {
            PostLoginGetApi("banks").then((responseJSON) => {
                var response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    var responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    setBankList(responseData["data"]["banks"]);
                    return;
                }
            }).catch((error) => {
                // toast.error("A problem occur. Please try again.");
                console.log(error);
            });
        }
        catch (exception) {
            toast.error("A problem occur.");
            console.log(exception);
        }

    }, []);

    const navigateTransferPage = (data) => {
        return navigate("/dashboard/instant-transfer/transfer", {
            state: {
                bankInfo: data
            }
        }
        );
    }


    // PAGINATION
    const perPageData = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [apiDataAdditional, setApiDataAdditional] = useState();
    const [isNextPage, setIsNextPage] = useState(false);
    const [isPrevPage, setIsPrevPage] = useState(false);
    const [totalPage, setTotalPage] = useState(1);
    const [tempBeneficiaryActiveList, setTempBeneficiaryActiveList] = useState([]);


    useEffect(() => {
        if (beneficiaryList.length > perPageData) {
            setIsNextPage(true);
        }

        if (currentPage >= totalPage) {
            setIsNextPage(false);
        }


        if ((currentPage > 1) && (currentPage <= totalPage)) {
            setIsPrevPage(true);
        }
        else {
            setIsPrevPage(false);
        }


        const startPoint = parseInt((currentPage - 1) * perPageData) + 1;
        let endPoint = parseInt(startPoint + perPageData - 1);
        if (endPoint > beneficiaryList.length) {
            endPoint = beneficiaryList.length;
        }
        setApiDataAdditional("Showing " + startPoint + " - " + endPoint + " out of " + beneficiaryList.length);
        setTempBeneficiaryActiveList(beneficiaryList.slice(startPoint - 1, endPoint));

    }, [beneficiaryList, currentPage, totalPage]);


    // Get Beneficiary lists
    useEffect(() => {
        try {
            PostLoginGetApi("wallet/withdraw-money-bank/beneficiary-list").then((responseJSON) => {
                var response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    var responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {

                        setTotalPage(Math.ceil(responseData["data"]["beneficiaries"]["verified"].length / perPageData));
                        setBeneficiaryList(responseData["data"]["beneficiaries"]["verified"]);
                        setInactiveAccount(responseData["data"]["beneficiaries"]["pending"]);

                        return;
                    }

                    toast.error(responseData["messages"].toString());
                    return;
                }
            }).catch((error) => {
                // toast.error("A problem occur. Please try again.");
                console.log(error);
            });
        }
        catch (exception) {
            toast.error("A problem occur.");
            console.log(exception);
        }
    }, [isBeneficiaryAdd, isRefresh]);


    const pagination = (next = 1) => {
        setCurrentPage(next);
    }


    useEffect(() => {
        if (UserBasicInfo?.name !== undefined) {
            inputs.accName = UserBasicInfo.name || "";
            return;
        }

    }, [UserBasicInfo]);



    const handleBank = (event) => {
        if (event.target.value === null || event.target.value === "") {
            setBankBranchList([]);
            return;
        }

        try {
            const reqBody = { bank_id: event.target.value };
            PostLoginGetApi("api/v1/bank/branches", reqBody, 0).then((responseJSON) => {
                var response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    var responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    setBank(event.target.value);
                    setBankBranchList(responseData["data"]["branches"]);
                    return;
                }
            }).catch((error) => {
                toast.error("A problem occur. Please try again.");
                console.log(error);
            });
        }
        catch (exception) {
            toast.error("A problem occur.");
            console.log(exception);
        }
    }

    const handleBranch = (event) => {
        setBranch(event.target.value)
    }

    // const handleChange = (e) => {
    //     setInputs({ ...inputs, [e.target.name]: e.target.value })
    // }

    const accNumberHandler = (event) => {
        const result = event.target.value.replace(/\D/g, '');
        setAccNumber(result)
    }

    const submitBeneficiaryAdd = (event) => {
        event.preventDefault();

        if (inputs.length === 0) {
            toast.error("Please enter account name and number.");
            return;
        }

        if (accNumber === undefined || accNumber === "") {
            toast.error("Please enter account number.");
            return;
        }

        if (bank === "") {
            toast.error("Please choose bank.");
            return;
        }

        if (branch === "") {
            toast.error("Please choose bank branch.");
            return;
        }

        try {
            const reqData = {
                bank_id: bank,
                bank_branch_id: branch,
                account_name: inputs.accName || "",
                account_no: accNumber
            };

            PostLoginPostApi("wallet/withdraw-money-bank/beneficiary-add", JSON.stringify(reqData)).then((responseJSON) => {
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    var responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);


                    if (responseData["code"] === 200) {
                        setInputs([]);
                        setBank("");
                        setBranch("");

                        setIsBeneficiaryAdd(true);

                        $("#bank_name, #branch_name").val("");
                        $("#accNumber").val("");

                        toast.success("Beneficiary added successfully.");
                        return;
                    }

                    toast.error(responseData["messages"].toString());
                    toast.error(responseData["data"][0].toString());
                    return;
                }

            }).catch((error) => {
                toast.error("A problem occur. Please try again.");
                console.log(error);
            });
        }
        catch (exception) {
            toast.error("A problem occur. Please try again.");
            console.log(exception);
        }

        setAccNumber('');
    }


    var bankTransferPage = (account_name, account_no, bank_id, bank_image, bank_name, bank_branch) => {
        navigate("/dashboard/transfer/bank-transfer-step-one",
            {
                state: {
                    bank_id: bank_id,
                    bank_image: bank_image,
                    bank_name: bank_name,
                    bank_branch: bank_branch,
                    account_name: account_name,
                    account_no: account_no
                }
            }
        );
    }

    const [currentTab, setCurrentTab] = useState("view-active-accounts");

    const handleTab = (tabId, event) => {
        $(".tablinks").removeClass("current");
        $(event.target).addClass("current");
        setCurrentTab(tabId);
    }



    const showDropDown = event => {
        $(".dropdownDotsHorizontal").hide();
        event.currentTarget.nextSibling.style.display = "block";
    }

    document.addEventListener('scroll', function () {
        $(".dropdownDotsHorizontal").hide();
    }, true);



    $('body').on("click", function (e) {
        if (e.target.parentElement.className !== "") {
            if (e.target.parentElement.className.toString().includes("dropdownMenuIconHorizontalButton mt-2") === false) {
                $(".dropdownDotsHorizontal").hide();
            }
        }
    });



    const moveToInactive = (id) => {

        try {
            PostLoginPostApi("wallet/withdraw-money-bank/beneficiary-status", JSON.stringify({ "banks": [id], "status": 0 }), 1, 0, 1).then((responseJSON) => {
                var response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    var responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);
                    console.log(responseData);
                    if (responseData["code"] === 200) {
                        setInactiveModal(false);

                        // setCurrentTab("view-inactive accounts");

                        $(".tablinks").eq(1).trigger("click");

                        toast.success("Account inactive successful");

                        setIsRefresh((prevCounter) => {
                            return prevCounter + 1;
                        });


                        return;
                    }

                    toast.error(responseData["messages"].toString());
                    return;

                }
            }).catch((error) => {
                toast.error("A problem occur. Please try again.");
                console.log(error);
            });
        }
        catch (exception) {
            toast.error("A problem occur.");
            console.log(exception);
        }


    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className='custom-container w-full px-8 py-10 pt-2 pr-6 font-montserrat flex' >

                {/* Left Side */}
                <div className="custom-container-left float-left custom-scroll-auto min-w-[80%] w-full mb-20 pb-[100px] pr-3 text-justify" style={{ boxShadow: "3px 0 0px 0px rgb(0 0 0 / 1%)" }}>

                    <div className="text-justify rounded-[5px] pb-3 pt-0">
                        <div className="w-1/2 float-left">
                            <h6 className="text-2xl px-4 font-medium pb-0 pl-0 pt-5">Here’s your balances at a glance</h6>
                        </div>

                        <div className="w-1/2 h-[68px] float-left text-right justify-end flex items-center">
                            <Link to="#" onClick={addBeneficiary} className="custom-btn filter text-center w-[200px]">Add Beneficiary</Link>
                            <svg id="filter-toggle-icon" className='static -ml-4' width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" fill="#1A202C" />
                                <path d="M17 19L13 15L17 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="#F5F5F5" />
                            </svg>
                        </div>
                    </div>


                    <div className="text-justify rounded-[5px] py-3">

                        <div className="w-full flex justify-between overflow-hidden text-left pb-5 pt-1">
                            <div className="box hover-black-green w-[33%] py-5 h-auto mr-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                                <Link to="#" className="block text-base ">
                                    Account Balance
                                    <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>

                                <h3 style={{ fontSize: "22px" }} className="font-semibold  opacity-70">{accountBalance.balances && accountBalance.balances[0]?.balance.toString().replace("৳", "৳ ")}</h3>
                            </div>
                            <div className="box hover-black-green w-[33%] py-5 h-auto mr-[1%] bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                                <Link to="#" className="block text-base font-medium">
                                    Total Withdraw
                                    <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>

                                <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">{accountBalance.summary && accountBalance.summary.withdrawn.toString().replace("৳", "৳ ")}</h3>
                            </div>

                            <div className="box hover-black-green w-[33%] py-5 h-auto float-right bg-[#FFFFFF] border-2 border-[#F5F5F5] text-[#222222] rounded-[5px] px-5">
                                <Link to="#" className="block text-base font-medium">
                                    Today's Withdraw
                                    <svg className="ml-1 display-revert" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>

                                <h3 style={{ "fontSize": "22px" }} className="font-semibold  opacity-70">{accountBalance.todays_withdraw && accountBalance.todays_withdraw.amount.toString().replace("৳", "৳ ")}</h3>
                            </div>
                        </div>

                        {/* TAB SWITCHER */}
                        <div className="tab w-full">
                            <button className="tablinks current" onClick={(event) => handleTab("view-active-accounts", event)}>Active Accounts</button>
                            <button className="tablinks" onClick={(event) => handleTab("view-inactive accounts", event)}>Inactive Accounts</button>
                        </div>

                        {currentTab === "view-active-accounts" ?
                            <div className='py-4'>
                                <table className="w-full custom-table-hover">
                                    <thead className='font-semibold py-6 bg-[#F5F5F5]'>
                                        <tr>
                                            <th className='rounded-t-lg py-2.5 px-5'>Account Number</th>
                                            <th>Account Name</th>
                                            <th>Bank</th>
                                            <th>Branch</th>
                                            <th className='rounded-tr-lg text-center min-w-[50px]'></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {tempBeneficiaryActiveList.length === 0 ? (<tr key={0} className="">
                                            <td className="py-2.5 px-5 text-center rounded-bl-md rounded-br-md " colSpan={5}>
                                                No Beneficiary Added Yet
                                            </td>
                                        </tr>)
                                            : tempBeneficiaryActiveList.map(val => (
                                                <tr key={val?.id} className="border-2 border-[#F5F5F5] border-b">
                                                    <td className='leading-[20px] text-base py-[10px] pl-[20px]'>{val?.ac_no}</td>
                                                    <td className='leading-[20px] text-base py-[10px]'>{val?.name}</td>
                                                    <td className='leading-[20px] text-base py-[10px]'>
                                                        <span className='flex'>
                                                            <div className='flex items-center mr-[5px]'>
                                                                <img src={val?.bank?.logo} alt={val?.bank?.bank_name} className='max-w-[44px] max-h-[44px]' />
                                                                <p className='px-3'>{val?.bank?.bank_name}</p>
                                                            </div>
                                                        </span>
                                                    </td>
                                                    <td>{val?.branch?.name}</td>
                                                    <td className='justify-center align-middle m-auto inset-y-auto'>
                                                        {/* <TransferButton name="Transfer" onClick={() => bankTransferPage(val?.name, val?.ac_no, val?.id, val?.bank?.logo, val?.bank?.bank_name, val?.branch?.name)} />
                                                        <button type="button" className="bg-red-600 border border-red-700 text-white py-[5px] px-5 rounded hover:bg-white hover:text-red-600"
                                                            onClick={() => setInactiveModal({ isShow: true, id: val?.id })} > Inactive</button> */}


                                                        <button onClick={showDropDown} data-dropdown-toggle="dropdownDotsHorizontal" className="dropdownMenuIconHorizontalButton mt-2">
                                                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                                                        </button>

                                                        <div className="dropdownDotsHorizontal hidden relative ">
                                                            <div className='absolute -ml-20 -mt-2 border border-[1px solid rgb(245, 245, 245)] bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600'>
                                                                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
                                                                    <li className='border-b-[1px] border-b-slate-100'>
                                                                        <span onClick={() => bankTransferPage(val?.name, val?.ac_no, val?.id, val?.bank?.logo, val?.bank?.bank_name, val?.branch?.name)} className="cursor-pointer block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                            Transfer
                                                                        </span>
                                                                    </li>
                                                                    {(val?.is_npsb_enable === true) &&
                                                                        <li className='border-b-[1px] border-b-slate-100'>
                                                                            <span onClick={() => navigateTransferPage(JSON.stringify(val))} className="cursor-pointer block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                                Instant Transfer
                                                                            </span>
                                                                        </li>
                                                                    }
                                                                    <li>
                                                                        <span onClick={() => setInactiveModal({ isShow: true, id: val?.id })} className="cursor-pointer block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                            Inactive
                                                                        </span>
                                                                    </li>

                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>

                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>


                                {/* Pagination */}
                                <p className='float-left mt-7'>
                                    {apiDataAdditional}
                                </p>


                                {(isNextPage === true) &&
                                    <button onClick={() => pagination((currentPage + 1))} className="custom-btn float-right mt-5 pr-2">
                                        Next Page&nbsp;&nbsp;&rarr;
                                    </button>
                                }

                                {(isPrevPage === true) &&
                                    <button onClick={() => pagination((currentPage - 1))} className="custom-btn float-right mt-5 mr-2">
                                        &larr;&nbsp;&nbsp;Previous Page
                                    </button>
                                }
                            </div>
                            :
                            <div className='py-4'>
                                <table className="w-full custom-table-hover">
                                    <thead className='font-semibold py-6 bg-[#F5F5F5]'>
                                        <tr>
                                            <th className='rounded-t-lg py-2.5 px-5'>Account Number</th>
                                            <th>Account Name</th>
                                            <th>Bank</th>
                                            <th className='rounded-tr-lg'>Branch</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {inactiveAccount.length === 0 ? (<tr key={0} className="">
                                            <td className="py-2.5 px-5 text-center rounded-bl-md rounded-br-md " colSpan={5}>
                                                No Inactive Account Added Yet
                                            </td>
                                        </tr>)
                                            : inactiveAccount.map(val => (
                                                <tr key={val?.id} className="border-2 border-[#F5F5F5] border-b">
                                                    <td className='leading-[20px] text-base py-[10px] pl-[20px]'>{val?.ac_no}</td>
                                                    <td className='leading-[20px] text-base py-[10px]'>{val?.name}</td>
                                                    <td className='leading-[20px] text-base py-[10px]'>
                                                        <span className='flex'>
                                                            <div className='flex items-center mr-[5px]'>
                                                                <img src={val?.bank?.logo} alt={val?.bank?.bank_name} className='max-w-[44px] max-h-[44px]' />
                                                                <p className='px-3'>{val?.bank?.bank_name}</p>
                                                            </div>
                                                        </span>
                                                    </td>
                                                    <td>{val?.branch?.name}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>
                </div>


                {/* Right Side */}
                <div id="filter-div" className="custom-container-right float-right w-1/5 pl-2 pb-10 pt-4 pr-0 ml-2 justify-center custom-scroll-auto mb-20 no-need-without-shadow">

                    <div className="relative">
                        <h6 className="text-lg font-base pb-2" style={{ boxShadow: "0 3px 0 0 rgb(0 0 0 / 1%)" }}>Add New Beneficiary</h6>

                        <div className='rounded-[8px] px-2 py-4 border border-gray-100'>

                            <form action='' method='POST' onSubmit={(event) => submitBeneficiaryAdd(event)}>

                                {/* bank select */}
                                <div className='text-base'>
                                    <p className='text-black'>Bank</p>
                                    <select id="bank_name" onChange={handleBank} className='w-full p-[5px] border-[1px] border-[#F5F5F5] rounded-[5px] text-[14px] text-[#222222] h-[40px] bg-[#f9f9f9] mt-[5px]' defaultValue={""} required >
                                        <option value="" disabled="disabled" className="text-black">Select Bank</option>
                                        {(bankList.length === 0) ? (
                                            <></>
                                        ) : (
                                            <>
                                                {bankList.map(val => (
                                                    <option key={val?.bank_id} value={val?.bank_id} className="text-black">{val?.bank_name}</option>
                                                ))}
                                            </>
                                        )}
                                    </select>
                                </div>

                                {/* branch select */}
                                <div className='text-base mt-4'>
                                    <p className='text-black'>Branch</p>
                                    <select id="branch_name" onChange={handleBranch} className='w-full p-[5px] border-[1px] border-[#F5F5F5] rounded-[5px] text-[14px] text-[#222222] h-[40px] bg-[#f9f9f9] mt-[5px]' defaultValue={""} required >
                                        <option value="" disabled="disabled" className='text-black'>Select Bank Branch</option>
                                        {(bankBranchList.length === 0) ? (
                                            <></>
                                        ) : (
                                            <>
                                                {bankBranchList.map(val => (
                                                    <option key={val?.branch_id} value={val?.branch_id} className="text-black">{val?.name}</option>
                                                ))}
                                            </>
                                        )}
                                    </select>
                                </div>


                                <div className='text-base mt-4'>
                                    <p className='text-black'>Account Name</p>
                                    <input type='text' disabled="disabled" defaultValue={UserBasicInfo?.name || ""} placeholder="Account Name" className='font-semibold w-full p-[5px] border-[1px] border-[#F5F5F5] rounded-[5px] text-[14px] text-[#222222] h-[40px] bg-[#f9f9f9] mt-[5px]' required />
                                </div>

                                <div className='text-base mt-4 mb-2'>
                                    <p className='text-black'>Account Number</p>
                                    <input type="text" id="accNumber" name="accNumber" value={accNumber || ""} onChange={accNumberHandler} placeholder='Account Number' className='w-full p-[5px] border-[1px] border-[#F5F5F5] rounded-[5px] text-[14px] text-[#222222] h-[40px] bg-[#f9f9f9] mt-[5px]' required />
                                </div>


                                <button type='submit' className="bg-[#1A202C] border-black border-[1px] mt-[12px] mb-3 text-white py-[10px] px-[20px] w-full rounded-[4px] hover:bg-white hover:text-black">Add Beneficiary</button>

                            </form>
                        </div>

                    </div>
                </div>

                {/* Popup */}
                {((inactiveModal?.isShow === true) && inactiveModal.id !== "") ? (
                    <>
                        <div
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                                {/*content*/}
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                    <button type="button" onClick={() => setInactiveModal(false)} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="popup-modal">
                                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    <div className="p-6 text-center">
                                        <svg aria-hidden="true" className="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to inactive this account?</h3>
                                        <button data-modal-toggle="popup-modal" type="button" onClick={() => moveToInactive(inactiveModal.id)} className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                            Yes, I'm sure
                                        </button>
                                        <button data-modal-toggle="popup-modal" type="button" onClick={() => setInactiveModal(false)} className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}



            </div>
        </Suspense>
    )
}

export default Transfer