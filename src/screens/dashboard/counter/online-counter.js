import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import $ from "jquery";




const OnlineStore = (props) => {

    const navigate = useNavigate();

    const [shopList, setShopList] = useState();
    const [isLoadData, setIsLoadData] = useState(false);


    useEffect(() => {
        setShopList(props.shops);
        setIsLoadData(true);
    }, [props]);


    const viewDetails = (info) => {
        navigate("details", { state: { info: info } })
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



    return (
        (isLoadData === false) ? "Loading.." :
            <div>
                <table className="w-full custom-table-hover">
                    <thead className='font-semibold bg-[#F5F5F5]'>
                        <tr>
                            <th className='rounded-tl-md py-2.5 w-[60px] text-center'>Logo</th>
                            <th className='py-2.5 px-3 text-left w-[150px]'>Counter ID</th>
                            {/* <th className='text-left'>Category</th> */}
                            <th className='text-left min-w-[150px]'>Location</th>
                            <th className='text-left'>Counter URL</th>
                            <th className='rounded-tr-md text-center min-w-[50px]'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {shopList.length >= 0 && shopList.map((val, index) =>
                            <tr className="border-x-2 border-b border-[#F5F5F5]" key={index}>
                                <td className="py-2.5 max-w-[60px] text-center">
                                    <center>
                                        <img src={val?.store_logo} alt="Store Logo" className='max-w-[40px] max-h-[40px]' />
                                    </center>
                                </td>
                                <td className="py-2.5 px-3 text-secondary">
                                    <span onClick={() => viewDetails(val)} className="text-green-500 cursor-pointer">{val?.store_id}</span>
                                </td>
                                {/* <td>{val?.store_category?.text}</td> */}
                                <td>{val?.address}</td>
                                <td>{val?.store_url}</td>
                                <td className='justify-center align-middle m-auto inset-y-auto'>
                                    <button onClick={showDropDown} data-dropdown-toggle="dropdownDotsHorizontal" className="dropdownMenuIconHorizontalButton mt-2">
                                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                                    </button>

                                    <div className="dropdownDotsHorizontal hidden relative ">
                                        <div className='absolute -ml-20 -mt-2 border border-[1px solid rgb(245, 245, 245)] bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600'>
                                            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
                                                <li className='border-b-[1px] border-b-slate-100'>
                                                    <span onClick={() => viewDetails(val)} className="cursor-pointer block py-2 px-10 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                        View
                                                    </span>
                                                </li>
                                                <li>
                                                    <Link to={"/dashboard/counter/edit"} state={{ data: val }} className="cursor-pointer block py-2 px-10 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                        Edit
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
    )
}


export default OnlineStore;
