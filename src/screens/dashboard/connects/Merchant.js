import React from 'react';
import { useState } from 'react';
import $ from "jquery";
import { useEffect } from 'react';
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';

const Merchant = ({ currentTab, props = '' }) => {

    const [merchantList, setMerchantList] = useState([]);
    const [reqParam, setReqParam] = useState({
        page: 1,
        lang: "en"
    });
    const [apiData, setApiData] = useState({});

    useEffect(() => {
        let search = props?.search;
        if (search !== null && search !== undefined && search !== "") {
            setReqParam({ ...reqParam, search });
        }
        else {
            setReqParam({ page: 1, lang: "en" });
        }
    }, [props]);


    useEffect(() => {

        //  Get Merchant list

        PostLoginGetApi("shop/connect", { filter: "merchant", ...reqParam }).then((responseJSON) => {
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if (response["status"] === 1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if (responseData["code"] === 200) {
                    setApiData(responseData["data"]);
                    setMerchantList(responseData["data"]?.data);
                }
            }
        }).catch((err) => {
            console.log(err);
        });
    }, [reqParam]);


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

    return (
        <div className="flex flex-col w-full pt-5">
            {/* DATA TABLE */}
            <div className='-m-1.5 overflow-x-auto pt-0'>
                <div className='p-1.5 min-w-full inline-block align-middle'>
                    <div className="border rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 custom-table-hover">
                            <thead className='bg-neutral-100'>
                                <tr className='text-left'>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Phone</th>
                                    <th scope="col" className="px-6 py-3">Type</th>
                                    <th scope="col" className="px-6 py-3 text-center">Added on</th>
                                </tr>
                                <tr></tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200 '>
                                {(merchantList.length === 0) &&
                                    <tr key="0">
                                        <td className='px-6 py-1 text-center' colSpan={6}>
                                            <p className='py-4'>No connects available</p>
                                        </td>
                                    </tr>
                                }

                                {merchantList.map((data, index) => (
                                    <tr key={index}>
                                        <td className='px-6 py-4 border-r-2'><Link to={`/dashboard/connects/connect-details/${data.id}`} state={{ from: currentTab }} className="cursor-pointer text-green-500">{data.user?.name}</Link></td>
                                        <td className='px-6 py-4 border-r-2'>{data.user?.mobile_no}</td>
                                        <td className='px-6 py-4 border-r-2'>{data.user?.user_type.replace(/^./, str => str.toUpperCase())}</td>
                                        <td className='px-6 py-4 border-r-2 text-center'>{moment(data.created_at).format('DD MMM, YYYY')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {(apiData?.from) !== undefined &&
                        <>

                            <p className='float-left mt-7'>
                                {`Showing ${apiData?.from * 1} - ${apiData?.to * 1} out of ${apiData?.total}`}
                            </p>


                            {(apiData?.next_page_url !== null && apiData?.links?.next_page_url !== "") &&
                                <button onClick={() => pagination(1)} className="custom-btn float-right mt-5">
                                    Next Page&nbsp;&nbsp;&rarr;
                                </button>
                            }

                            {(apiData?.prev_page_url !== null && apiData?.prev_page_url !== "") &&
                                <button onClick={() => pagination(0)} className="custom-btn float-right mt-5 mr-2">
                                    &larr;&nbsp;&nbsp;Previous Page
                                </button>
                            }

                        </>

                    }
                </div>
            </div>
        </div>













    );
};

export default Merchant;