import React, { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import BlackButton from '../../../components/BlackButton';
import proPic from '../../../assets/images/pro_pic.jpg'
import shareTrip from '../../../assets/images/shareTrip.jpg'
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg'
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';
import { useState } from 'react';
import moment from 'moment';

const ViewConnect = () => {

    const { id } = useParams();
    const [connectDetails, setConnectDetails] = useState();
    const [isLoad, setIsLoad] = useState(false);
    const [recentInvoices, setRecentInvoices] = useState([]);
    let { state } = useLocation();

    



    useEffect(() => {
        try {
            PostLoginGetApi(`shop/connect/${id}`).then((responseJSON) => {
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        setConnectDetails(responseData["data"]);
                        setRecentInvoices(responseData["data"]["recent_invoices"]);
                        setIsLoad(true);
                    }
                }

            }).catch((err) => {
                console.log(err);
            });
        }
        catch (ex) {
            console.log(ex);
        }

    }, [])

    useEffect(() => {
        console.log(recentInvoices);
    })


    return (
        <>
            {isLoad === true &&
                <div className="h-full">
                    <header className="p-4 border-b-2 border-dark-white mb-[60px]">
                        <Link to="/dashboard/connects" state={{ from: state }}><CloseBtn className="float-left" /></Link>
                        <p className="text-center text-xl font-medium">Connect Details</p>
                    </header>
                    <main className="max-w-2xl m-auto">
                        {/* Save as Connect */}

                        <div className="flex items-center justify-between border border-solid border-neutral-100 p-5 rounded" style={{ boxShadow: "0px 4px 40px rgba(0,0,0,0.05)" }}>
                            <div className="flex items-center ">
                                <img src={connectDetails?.user?.avatar} alt="pro pic" className="w-[80px] h-[80px] object-cover rounded-full" />
                                {/* <img src={shareTrip} alt="pro pic" className="rounded-md" /> */}
                                <div className="ml-5">
                                    <h4 className="text-xl mb-2.5">{connectDetails?.user?.name}</h4>
                                    <p>{connectDetails?.user?.mobile_no}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-ash mb-2.5">Account Type</p>
                                <p className="text-end">{connectDetails?.user?.user_type}</p>
                            </div>
                        </div>

                        <div className="my-5 flow-root px-2">
                            <p className="text-ash mb-5">Recipient Info</p>
                            <div className="float-left text-secondary">
                                <p className="mb-2.5">Email</p>
                                <p className="mb-2.5">Shipping</p>
                                <p className="mb-2.5">Added on</p>
                            </div>
                            <div className="float-right text-end">
                                <p className="mb-2.5">{connectDetails?.user?.email}&nbsp;</p>
                                <p className="mb-2.5">{connectDetails?.user?.address}&nbsp;</p>
                                <p className="mb-2.5">{moment(connectDetails?.user?.created_at).format("DD MMMM, YYYY")}&nbsp;</p>
                            </div>
                        </div>

                        <div className='flex mb-5 w-full justify-between'>
                            <div className='p-5 bg-white border-solid border border-neutral-100 rounded w-[49%]' style={{ boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.05)' }}>
                                <p className='mb-2.5'>Invoice Paid</p>
                                <h3 className='font-semibold text-xl text-[#03A629]'>৳ {connectDetails?.receivable?.total_received}</h3>
                            </div>
                            <div className='p-5 bg-white border-solid border border-neutral-100 rounded w-[49%]' style={{ boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.05)' }}>
                                <p className='mb-2.5'>Invoice Due</p>
                                <h3 className='font-semibold text-xl text-[#0774E9]'>৳ {connectDetails?.receivable?.total_pending}</h3>
                            </div>
                        </div>

                        <p className='text-ash mb-5'>Recent Invoices</p>

                        <div className='-m-1.5 overflow-x-auto pt-0 mb-5'>
                            <div className='p-1.5 min-w-full inline-block align-middle'>
                                <div className="border rounded-lg shadow overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200 custom-table-hover">
                                        <thead className='bg-neutral-100'>
                                            <tr className='text-left'>
                                                <th scope="col" className="px-6 py-3">Create Date</th>
                                                <th scope="col" className="px-6 py-3">ID</th>
                                                <th scope="col" className="px-6 py-3">Status</th>
                                                <th scope="col" className="px-6 py-3">Amount</th>
                                            </tr>

                                        </thead>
                                        <tbody className='divide-y divide-gray-200'>
                                            {(recentInvoices.length === 0) &&
                                                <tr key="0">
                                                    <td className='px-6 py-1 text-center' colSpan={4}>
                                                        <p className='py-4'>No invoice available</p>
                                                    </td>
                                                </tr>
                                            }


                                            {recentInvoices.map((data, index) => (
                                                (data !== null) &&
                                                <tr key={index}>
                                                    <td className='px-6 py-4'>{moment(data?.created_at).format("DD MMMM, YYYY")}</td>
                                                    <td className='px-6 py-4'>{data?.invoice_id}</td>
                                                    <td className='px-6 py-4'>{data?.status}</td>
                                                    <td className='px-6 py-4'>৳ {data?.total_bill_amount}</td>
                                                </tr>
                                            ))
                                            }


                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <BlackButton name="Create Invoice" />
                    </main>
                </div>
            }
        </>
    );
};

export default ViewConnect;