import React, {useEffect, useState, useRef} from "react";
import {ReactComponent as CloseBtn} from '../../../../assets/icons/close.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../../../../components/FileUpload/style.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewBusinessdetails = (props) => {


    const [data, setData] = useState(null);
    const [address, setAddress] = useState(null);
    

    useEffect(()=>{
        let requestData = JSON.stringify(props?.uploadInfo);
        requestData = JSON.parse(requestData);
        
        if(requestData.desi_user_id) {
            let arr = Object.assign([],requestData.merchant_addresses);
            let address = arr.filter(i => i.address_type==="owner_present");
            setAddress(address[0]);
        }

        setData(requestData);
    },[props]);


    
    return (
        <div className="font-medium h-[100vh] w-[100vw] max-w-[100vw] overflow-x-hidden">
            <header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[60px]">
                <Link to="/dashboard/home"><CloseBtn/></Link>
                <p className="text-xl -mr-3">Uploaded Business Details</p>
                <div className="mr-3"></div>
            </header>
            <main className="m-auto max-w-3xl">
                <div className="flex justify-center">
                    {(data !== null) && 
                    <table id="voucher-details-table" className="custom-details-table w-full mt-0 mb-5">
                        <tbody>
                            <tr>
                                <td className="font-semibold text-base">Doing Business As</td>
                                <td className="px-5 text-base">
                                    {data.name}
                                </td>
                            </tr>
                            <tr>
                                <td className="bg-white font-semibold text-base text-center" style={{backgroundColor: "#FFF"}} colSpan={2}>Present Address</td>
                            </tr>
                            
                            {(address !== null) && <>
                                <tr>
                                    <td className="font-semibold text-base">Address Details</td>
                                    <td className="px-5 text-base">
                                        {address.address}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-base">Division</td>
                                    <td className="px-5 text-base">
                                        {address.division_name}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-base">Thana</td>
                                    <td className="px-5 text-base">
                                        {address.thana_name}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-base">City & Post Code</td>
                                    <td className="px-5 text-base">
                                        {address.district_name} - {address.post_code}
                                    </td>
                                </tr>
                            </>}
                            <tr>
                                <td className="bg-white font-semibold text-base text-center" style={{backgroundColor: "#FFF"}} colSpan={2}>Bank Details</td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-base">Account Name</td>
                                <td className="px-5 text-base">
                                    {data.bank_account?.account_name}
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-base">Account No.</td>
                                <td className="px-5 text-base">
                                    {data.bank_account?.account_no}
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-base">Bank Name</td>
                                <td className="px-5 text-base">
                                    {data.foreign_key_data?.bank_id}
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-base">Bank Branch</td>
                                <td className="px-5 text-base">
                                    {data.foreign_key_data?.branch_id}
                                </td>
                            </tr>
                            
                            <tr>
                                <td className="bg-white font-semibold text-base text-center" style={{backgroundColor: "#FFF"}} colSpan={2}>Transaction Profile</td>
                            </tr>
                            
                            <tr>
                                <td className="font-semibold text-base">Nature of Business</td>
                                <td className="px-5 text-base">
                                    {data.foreign_key_data?.business_nature_id}
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-base">Net Asset Range</td>
                                <td className="px-5 text-base">
                                    {data.foreign_key_data?.net_asset_range}
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-base">Est. Monthly Transaction</td>
                                <td className="px-5 text-base">
                                    {data.foreign_key_data?.monthly_transaction_volume}
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-base">Est. no of Transaction / Month</td>
                                <td className="px-5 text-base">
                                    {data.foreign_key_data?.monthly_transaction_number}
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-base">Est. Highest Amount in Single Transaction</td>
                                <td className="px-5 text-base">
                                    {data.foreign_key_data?.highest_volume}
                                </td>
                            </tr>

                            <tr>
                                <td className="bg-white font-semibold text-base text-center" style={{backgroundColor: "#FFF"}} colSpan={2}>Verification Docs</td>
                            </tr>
                            
                            {data.business_kyb_documents?.map((val,index) => {
                                return (
                                    <tr key={index}>
                                        <td className="font-semibold text-base">{val?.type}</td>
                                        <td className="px-5 text-base">
                                            <a className="text-blue-600" href={val?.attachment} target="_blank" rel="noreferrer">View {val?.type}</a>
                                        </td>
                                    </tr>
                                );
                            })}

                            <tr>
                                <td className="font-semibold text-base">Business Logo</td>
                                <td className="px-5 text-base">
                                    <img src={data.business_profiles?.business_logo} alt="Business Logo" className="h-24"></img>
                                </td>
                            </tr>
                            


                        </tbody>
                    </table>   
                    } 
                </div>
            </main>

            <style>{`
            table.custom-details-table tr td:first-child {
                width: 250px;
            }
            `}</style>

        </div>
    );
};

export default ViewBusinessdetails;