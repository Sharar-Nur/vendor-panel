
import React, { Suspense, useEffect, useState } from 'react';
import TransferButton from '../transfer/transferButton';
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg';
import { Link, useNavigate } from 'react-router-dom';
import PostLoginGetApi from '../../../components/api/PostLoginGetApi';
import { toast } from 'react-toastify';


const BankLists = () => {

    const navigate = useNavigate();
    const [isLoad, setIsLoad] = useState(false);
    const [bankList, setBankList] = useState([]);

    const navigateTransferPage = (data) => {
        return navigate("/dashboard/instant-transfer/transfer", {
                state: {
                    bankInfo: data
                }
            }
        );
    }


    useEffect(()=>{
        try {
            PostLoginGetApi("wallet/withdraw-money-bank/beneficiary-list").then((responseJSON) => {
                var response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if (response["status"] === 1) {
                    var responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);

                    if (responseData["code"] === 200) {
                        setBankList(responseData["data"]["beneficiaries"]["verified"].filter(i => i.is_npsb_enable===true));
                        return;
                    }

                    toast.error(responseData["messages"].toString());

                    
                    return;
                }
            }).catch((error) => {
                console.log(error);
            }).finally(()=>{
                setIsLoad(true);
            });
        }
        catch (exception) {
            toast.error("A problem occur.");
            console.log(exception);
        }
    },[]);

    return (
        <div className='h-[100vh] custom-scroll-auto '>

            {(bankList.length > 0) ? 
            <header className="flex justify-between items-center p-4 border-b-2 border-dark-white">
                
                <Link to="/dashboard/home"><CloseBtn className="float-left" /></Link>
                <p className="text-center text-lg font-semibold">Instant Transfer</p>

                <Link to={"/dashboard/instant-transfer/bank-add"} type="button" className=" text-white bg-[#1A202C] py-[7px] px-[25px] rounded-[3px] text-base cursor-pointer flex justify-center border border-black hover:bg-white hover:text-black hover:border hover:border-black">
                    Add NPSB Listed Bank    
                </Link>

            </header>
            :
            <header className="p-4 border-b-2 border-dark-white">
                
                <Link to="/dashboard/home"><CloseBtn className="float-left" /></Link>
                <p className="text-center text-lg font-semibold">Instant Transfer</p>

            </header>
            }

            <main className="m-auto mb-20">

                {(isLoad) ? 
                    <>
                        {(bankList.length > 0) ? 
                            <center>
                                <table className="w-full max-w-6xl mt-20 custom-table-hover">
                                    <thead className='font-semibold py-6 bg-[#F5F5F5]'>
                                        <tr>
                                            <th className='rounded-tl-lg py-4 px-5 text-left'>Account Number</th>
                                            <th className='text-left px-2'>Account Name</th>
                                            <th className='text-left px-2'>Bank</th>
                                            <th className='text-left px-2'>Branch</th>
                                            <th className='rounded-tr-lg text-right min-w-[100px]'></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {bankList.map((data,index)=>
                                        <tr key={index} className="border-b-2 border-[#F5F5F5]">
                                            <td className='leading-[20px] text-base py-[10px] pl-[20px] px-2'>{data.ac_no}</td>
                                            <td className='leading-[20px] text-base py-[10px] px-2'>{data.name}</td>
                                            <td className='leading-[20px] text-base py-[10px] px-2'>
                                                <span className='flex'>
                                                    <div className='flex items-center mr-[5px]'>
                                                        <img src={data.bank?.logo} alt={data.bank?.code} className='max-w-[44px] max-h-[44px]' />
                                                        <p className='px-3'>{data.bank?.bank_name}</p>
                                                    </div>
                                                </span>
                                            </td>
                                            <td className='px-2'>{data.branch?.name}</td>
                                            <td className='float-right pt-4 rounded-bl-lg rounded-br-lg'>
                                                <TransferButton name="Transfer" onClick={()=>navigateTransferPage(JSON.stringify(data))} />
                                            </td>
                                        </tr>
                                        )}
                                    </tbody>
                                </table>
                            </center>
                            :
                            <div className='flex flex-col justify-center items-center h-full mt-[15%]'>
                                <svg width="102" height="100" viewBox="0 0 102 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_5423_38340)">
                                        <path d="M91.1414 51.4925C91.1414 60.1416 91.1414 68.7162 91.1414 77.2826C93.7617 78.3655 94.0868 78.8642 94.0896 81.7738C94.0924 83.2204 94.0979 84.6669 94.1116 86.1135C94.1116 86.2072 94.1805 86.3009 94.2604 86.4965C95.842 86.4965 97.4539 86.491 99.063 86.4993C100.623 86.5048 101.039 86.9126 101.039 88.4363C101.044 91.6738 101.044 94.9141 101.039 98.1516C101.036 99.5514 100.587 100 99.187 100C67.0513 100.003 34.9129 100.003 2.77723 100C1.43537 100 0.966963 99.5431 0.964207 98.2178C0.955941 94.9113 0.955941 91.6022 0.964207 88.2957C0.966963 86.9566 1.41609 86.5103 2.76896 86.502C4.89885 86.4882 7.02874 86.4993 9.26333 86.4993C9.29088 86.0501 9.3267 85.6892 9.32946 85.3255C9.33772 83.7742 9.30741 82.2229 9.34323 80.6744C9.37905 79.1177 10.0817 78.0899 11.5117 77.6353C12.1482 77.4341 12.2556 77.109 12.2556 76.5249C12.2419 68.4627 12.2446 60.4006 12.2501 52.3384C12.2501 51.8397 12.2474 51.465 11.6192 51.2555C10.0376 50.7293 9.36528 49.7511 9.34048 48.0841C9.31293 46.2298 9.33497 44.3727 9.33497 42.3585C8.87482 42.3585 8.51387 42.3585 8.15017 42.3585C6.39225 42.3585 4.63709 42.3723 2.87918 42.3502C1.82939 42.3365 1.2425 41.8681 1.23148 40.9092C1.19566 37.465 1.21494 34.0181 1.22046 30.5739C1.22321 29.7252 1.83214 29.3312 2.47139 28.9482C9.42314 24.7546 16.3749 20.5582 23.3294 16.359C32.108 11.0605 40.8948 5.77295 49.6568 0.444095C50.6074 -0.134529 51.3596 -0.153817 52.3102 0.422052C67.8834 9.84811 83.4622 19.2659 99.074 28.6313C100.369 29.4084 100.879 30.279 100.824 31.7752C100.716 34.6297 100.796 37.4926 100.791 40.3526C100.788 41.9204 100.347 42.3502 98.7517 42.3585C97.2445 42.364 95.7373 42.3585 94.0896 42.3585C94.0896 44.1412 94.0924 45.8192 94.0896 47.4972C94.0868 49.9495 93.4917 50.7678 91.1414 51.4925ZM97.9195 39.4571C97.9195 39.1072 97.9195 38.7738 97.9195 38.4404C97.9195 36.3739 97.881 34.3046 97.9416 32.2409C97.9636 31.5052 97.6716 31.147 97.0847 30.7915C81.9936 21.7016 66.9136 12.598 51.839 3.48049C51.2384 3.11679 50.8085 3.08372 50.1858 3.46121C42.7491 7.98549 35.2904 12.4767 27.8399 16.9762C20.18 21.5997 12.5202 26.2204 4.8713 30.8604C4.55443 31.0505 4.1246 31.4087 4.11909 31.6981C4.06122 34.2688 4.08602 36.8423 4.08602 39.4571C35.3978 39.4571 66.5857 39.4571 97.9195 39.4571ZM3.82426 89.4144C3.82426 90.7397 3.82426 92.0017 3.82426 93.2664C3.82426 94.5283 3.82426 95.7903 3.82426 97.0633C35.3427 97.0633 66.7207 97.0633 98.0876 97.0633C98.0876 94.4595 98.0876 91.9328 98.0876 89.4117C66.6463 89.4144 35.2959 89.4144 3.82426 89.4144ZM58.7412 77.3157C61.2513 78.2277 61.7142 78.9 61.7142 81.5947C61.7142 83.1983 61.7142 84.802 61.7142 86.4166C65.4587 86.4166 69.0517 86.4166 72.6998 86.4166C72.6998 84.4465 72.7053 82.5536 72.697 80.6607C72.6943 79.6329 73.0442 78.7457 73.8736 78.145C74.3833 77.7758 75.0088 77.5664 75.5902 77.2826C75.5902 68.6859 75.5902 60.0837 75.5902 51.498C73.2371 50.7017 72.6998 49.944 72.697 47.478C72.697 45.8027 72.697 44.1274 72.697 42.4329C68.9746 42.4329 65.3788 42.4329 61.7115 42.4329C61.7115 44.0889 61.7115 45.6704 61.7115 47.2493C61.7115 49.9495 61.2541 50.6136 58.7384 51.5311C58.7412 60.1223 58.7412 68.7245 58.7412 77.3157ZM43.2589 77.3267C43.2589 68.7327 43.2589 60.125 43.2589 51.6633C42.5011 51.2197 41.6442 50.969 41.2089 50.3959C40.7074 49.7346 40.3823 48.8033 40.3244 47.9684C40.1977 46.1333 40.2858 44.2845 40.2858 42.4439C37.0125 42.4439 33.9017 42.4439 30.7385 42.4439C30.7385 44.1109 30.7385 45.6952 30.7385 47.2768C30.7385 49.9275 30.3225 50.5474 27.9005 51.5118C27.9005 60.1443 27.9005 68.7768 27.9005 77.3873C30.0883 78.0844 30.7358 78.9579 30.7385 81.1621C30.7413 82.9063 30.7385 84.6532 30.7385 86.4221C33.9788 86.4221 37.0924 86.4221 40.2858 86.4221C40.2858 84.7358 40.2858 83.1184 40.2858 81.5038C40.2858 78.9083 40.7983 78.1836 43.2589 77.3267ZM24.8862 77.3873C24.8862 68.6969 24.8862 60.0809 24.8862 51.4897C21.5935 51.4897 18.378 51.4897 15.157 51.4897C15.157 60.1608 15.157 68.7493 15.157 77.3873C18.4139 77.3873 21.6046 77.3873 24.8862 77.3873ZM46.2016 77.3928C49.4226 77.3928 52.5775 77.3928 55.7985 77.3928C55.7985 68.73 55.7985 60.1085 55.7985 51.4484C52.5775 51.4484 49.4226 51.4484 46.2016 51.4484C46.2016 60.1085 46.2016 68.73 46.2016 77.3928ZM78.5494 77.3542C81.8365 77.3542 85.0162 77.3542 88.1959 77.3542C88.1959 68.6859 88.1959 60.0975 88.1959 51.4705C84.9556 51.4705 81.7759 51.4705 78.5494 51.4705C78.5494 60.1195 78.5494 68.7079 78.5494 77.3542ZM27.8234 42.5045C22.5772 42.5045 17.4302 42.5045 12.2474 42.5045C12.2474 44.5242 12.2474 46.4667 12.2474 48.4396C17.4798 48.4396 22.6461 48.4396 27.8234 48.4396C27.8234 46.4282 27.8234 44.5077 27.8234 42.5045ZM58.7853 42.4853C53.5749 42.4853 48.4251 42.4853 43.2368 42.4853C43.2368 44.5132 43.2368 46.4833 43.2368 48.4534C48.4637 48.4534 53.6107 48.4534 58.7853 48.4534C58.7853 46.4309 58.7853 44.4856 58.7853 42.4853ZM27.7738 86.378C27.7738 84.3143 27.7738 82.3414 27.7738 80.4154C22.5441 80.4154 17.4026 80.4154 12.2612 80.4154C12.2612 82.4489 12.2612 84.3914 12.2612 86.378C17.4605 86.378 22.5827 86.378 27.7738 86.378ZM58.7825 86.3863C58.7825 84.328 58.7825 82.3855 58.7825 80.4154C53.5501 80.4154 48.3811 80.4154 43.2313 80.4154C43.2313 82.4572 43.2313 84.4052 43.2313 86.3863C48.4334 86.3863 53.5611 86.3863 58.7825 86.3863ZM91.2488 48.4782C91.2488 46.7864 91.202 45.1442 91.2681 43.5047C91.3039 42.634 91.0174 42.4054 90.166 42.4136C85.6252 42.4522 81.0843 42.4302 76.5435 42.4357C76.2459 42.4357 75.9511 42.4797 75.6646 42.5018C75.6646 44.549 75.6646 46.5163 75.6646 48.4782C80.8722 48.4782 85.9861 48.4782 91.2488 48.4782ZM91.18 80.3961C85.9338 80.3961 80.795 80.3961 75.6287 80.3961C75.6287 82.4158 75.6287 84.3611 75.6287 86.3642C80.8281 86.3642 85.9696 86.3642 91.18 86.3642C91.18 84.3666 91.18 82.4241 91.18 80.3961Z" fill="#8B8F97"/>
                                        <path d="M42.4683 23.2638C42.4545 18.5466 46.2459 14.7194 50.9575 14.6974C55.6664 14.6726 59.5102 18.4805 59.5294 23.1839C59.5487 27.9727 55.7711 31.7751 50.9823 31.7861C46.2652 31.7971 42.4821 28.0085 42.4683 23.2638ZM51.0264 28.9095C54.1537 28.8957 56.6859 26.3746 56.6887 23.2748C56.6914 20.1227 54.1152 17.5382 50.9741 17.5464C47.8798 17.5547 45.3394 20.1089 45.3256 23.2224C45.3146 26.4104 47.833 28.9233 51.0264 28.9095Z" fill="#8B8F97"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_5423_38340">
                                            <rect width="100.088" height="100" fill="white" transform="translate(0.956055)"/>
                                        </clipPath>
                                    </defs>
                                </svg>


                                <h1 className='text-xl font-semibold mt-2 pt-3 text-[#1A202C]'>You didn’t add any NPSB listed Bank</h1>
                                <p className='text-sm pt-1 text-[#444444]'>Please add NPSB listed bank for transfer instantly.</p>

                                <Link to={"/dashboard/instant-transfer/bank-add"} type="button" className=" text-white bg-[#1A202C] py-[7px] px-[25px] rounded-[3px] text-base cursor-pointer flex justify-center my-4 border border-black hover:bg-white hover:text-black hover:border hover:border-black">
                                    Add NPSB Listed Bank    
                                </Link>

                            
                            </div>
                        }
                    </>
                :
                    <>Please wait...</>
                }

                
            </main>
        </div>
    );
};

export default BankLists;