import React, { useEffect, useState, useRef } from "react";
import { ReactComponent as CloseBtn } from '../../../../assets/icons/close.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../../../../components/FileUpload/style.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewCompleteProfile = (props) => {

    const [data, setData] = useState({
        is_skip: false,
        nid: "",
        photo: ""
    });


    useEffect(() => {

        let requestData = JSON.stringify(props?.uploadInfo);
        requestData = JSON.parse(requestData);

        if (requestData.business_profiles?.skip_representative !== 0) {
            setData({ is_skip: true });
            return;
        }


        let arr = Object.assign([], requestData.business_verification_docs);
        if (arr.length > 0) {
            let representative_nid = arr.filter(i => i.verification_doc_type === "representative_nid");
            let representative_photo = arr.filter(i => i.verification_doc_type === "representative_photo");

            console.log(representative_nid);

            setData({ photo: representative_photo[0].verification_doc_file, nid: representative_nid[0].verification_doc_file + "#toolbar=0" });
        }
    }, [props]);


    return (
        <div className="font-medium h-[100vh] w-[100vw]">
            <header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[60px]">

                <Link to="/dashboard/home"><CloseBtn /></Link>

                <p className="text-xl -mr-3">Uploaded Verify Identity</p>
                <div className="mr-3"></div>
            </header>
            <main className="m-auto max-w-2xl">
                <div className="flex justify-center">
                    <table id="voucher-details-table" className="custom-details-table w-full mt-0 mb-5">
                        <tbody>
                            <tr>
                                <td className="font-semibold text-base">Representative’s Info Skip ?</td>
                                <td className="px-5 text-base">
                                    <center>
                                        {(data?.is_skip === false) ? "Yes" : "No"}
                                    </center>
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-base">Representative’s NID</td>
                                <td className="px-5 text-base">
                                    <center>
                                        {(data?.nid !== "-") ?
                                            <>
                                                <iframe src={data?.nid} title="Owner's NID" height={400} style={{ border: 0, outline: 0 }}></iframe>
                                                <a href={data?.nid} target="_blank" title="Representative's NID" rel="noreferrer">View in Full Screen</a>
                                            </>
                                            :
                                            <>
                                                -
                                            </>
                                        }
                                    </center>
                                </td>
                            </tr>
                            <tr>
                                <td className="font-semibold text-base">Representative’s Photo</td>
                                <td className="p-5 text-base text-center">
                                    {(data?.photo !== "-") ?
                                        <img src={data?.photo} alt="Uploaded Info # 2" title="Uploaded Info # 2" />
                                        :
                                        <>
                                            -
                                        </>
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default ViewCompleteProfile;