
import React, { useContext, useState } from 'react';
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';
import { toast } from 'react-toastify';
import PostLoginPostApi from '../../../components/api/PostLoginPostApi';
import UserBasicInfoContext from '../../../components/context/UserBasicInfoContext';




const BankAdd = () => {
    const [accNumber, setAccNumber] = useState('')
    const navigate = useNavigate();
    const UserBasicInfo = useContext(UserBasicInfoContext);


    // Default Input Setup
    const [input, setInput] = useState({
        bank: "",
        branch: "",
        account_name: UserBasicInfo?.name,
        account_number: accNumber
    });

    // Submit Form
    const submitFormData = (event) => {
        event.preventDefault();


        if (input.length === 0) {
            toast.error("Please enter account name and number.");
            return;
        }

        if (accNumber === undefined || accNumber=== "") {
            toast.error("Please enter account number.");
            return;
        }

        if (input.bank === "") {
            toast.error("Please choose bank.");
            return;
        }

        if (input.branch === "") {
            toast.error("Please choose bank branch.");
            return;
        }

        try {
            const reqData = {
                bank_id: input.bank,
                bank_branch_id: input.branch,
                account_name: UserBasicInfo?.name,
                account_no: accNumber
            };

            PostLoginPostApi("wallet/withdraw-money-bank/beneficiary-add", JSON.stringify(reqData)).then((responseJSON) => {
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    var responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);


                    if (responseData["code"] === 200) {
                        toast.success("NPSB listed beneficiary added successfully.");
                        return navigate("/dashboard/instant-transfer/bank-lists");
                    }

                    toast.error(responseData["messages"].toString());
                    toast.error(responseData["data"].toString());
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
    }
    

    // Get all bank lists
    const [bankList, setBankList] = useState([]);
    useEffect(() => {
        try {
            PostLoginGetApi("banks").then((responseJSON) => {
                var response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    var responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    setBankList(responseData["data"]["banks"].filter(i => i.is_npsb_enable===1));
                    return;
                }
            }).catch((error) => {
                console.log(error);
            });
        }
        catch (exception) {
            toast.error("A problem occur please try again.");
            console.log(exception);
        }

    }, []);


    // Get branch lists by bank
    const [branchList, setBankBranchList] = useState([]);
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

                    setInput({...input, bank: event.target.value});
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

    

    const accNumberHandler = (event) => {
        const result = event.target.value.replace(/\D/g, '');
        setAccNumber(result)
    }

    return (
        <div className="font-medium min-h-[100vh] w-[100%] h-[100%] custom-container-left custom-scroll-auto">
            
            <header className="p-4 border-b-2 border-dark-white ">
                <Link to="/dashboard/instant-transfer/bank-lists"><CloseBtn className="float-left" /></Link>
                <p className="text-center text-lg font-semibold">Add NPSB Listed Beneficiary</p>
            </header>

            <main className="max-w-3xl m-auto my-8">

                <form action='' method='POST' className="w-full" onSubmit={(event) => submitFormData(event)} >
                    
                    <h3 className="text-base mt-[8px] mb-[5px] font-semibold">Bank</h3>
                    <div>
                        <select type="text" id="bank" name="bank" onChange={(event)=>handleBank(event)} defaultValue="" className="w-full mb-2.5 rounded border-solid border  border-gray-200 placeholder:text-ash" required>
                            <option value="" disabled >Select Bank</option>
                            {bankList.map((data,index)=>
                                <option key={index} value={data.bank_id} className="text-black">{data.bank_name}</option>
                            )}
                        </select>
                    </div>

                    <h3 className="text-base mt-[8px] mb-[5px] font-semibold">Branch</h3>
                    <div>
                        <select type="text" id="branch" name="branch" defaultValue="" onChange={(event)=>setInput({...input, branch: event.currentTarget.value})} className="w-full mb-2.5 rounded border-solid border  border-gray-200 placeholder:text-ash" required>
                            <option value="" disabled >Select Branch</option>
                            {branchList.map((data,index)=>
                                <option key={index} value={data.branch_id} className="text-black">{data.name}</option>
                            )}
                        </select>
                    </div>

                    <h3 className="text-base mt-[8px] mb-[5px] font-semibold">Account Name</h3>
                    <div>
                        <input type="text" id="accountName" name="accountName" value={UserBasicInfo?.name} placeholder="Enter Account Name" className="bg-gray-100 w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" disabled />
                    </div>

                    <h3 className="text-base mt-[8px] mb-[5px] font-semibold">Account Number</h3>
                    <div>
                        <input type="text" id="accountNumber" name="accountNumber" value={accNumber} onChange={accNumberHandler} placeholder="Enter Account Number" className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" required />
                    </div>


                    <button type="submit" className=" text-white bg-[#1A202C] py-[10px] rounded-[3px] w-full text-base cursor-pointer flex justify-center my-4 border border-black hover:bg-white hover:text-black hover:border hover:border-black">
                        Add Beneficiary  
                    </button>


                </form>

                
            </main>

            <style>{`
            select:required:invalid {
                color: gray;
            }
            option[value=""][disabled] {
                display: none;
            }
            option {
                color: black;
            }
            `}</style>

        </div>
    );
};

export default BankAdd;