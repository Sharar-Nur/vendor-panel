import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';

// Assets
import { ReactComponent as CloseBtn } from '../../../../../assets/icons/close.svg';
import FileUploadIcon from '../../../../../assets/icons/UploadFileIcon.png';
import '../../../../../components/FileUpload/style.css';

// Toast Notification
import { toast } from 'react-toastify';


export default function UploadDocuments() {

    const [inputFile, setInputFile] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    let navigate = useNavigate();
    const { state } = useLocation();
    let { file } = useParams();

    const [docInfo, setDocInfo] = useState([]);

    useEffect(() => {
        if (state === null || state?.docInfo === undefined || state?.docInfo === "" || state?.docInfo === null) {
            toast.error("Please update Business Details first.");
            return navigate("/dashboard/business-details");
        }

        if (state?.docInfo.length === 0) {
            return navigate("/dashboard/home");
        }

        if (parseInt(file) > state?.docInfo.length) {
            toast.error("Invalid file upload page.");
            return navigate("/dashboard/home");
        }

        setDocInfo(state?.docInfo[parseInt(file) - 1]);
    }, [state]);


    useEffect(() => {
        if (inputFile.length === 0) {
            return;
        }

        return navigate("/dashboard/business-details-upload-documents-preview-and-submit/" + file, {
            state: {
                uploadedFile: inputFile[0].src,
                docInfo: state.docInfo
            }
        });

    }, [file, inputFile, navigate, state?.docInfo]);


    function handleFile(files) {
        var index = files.length - 1;

        if (files[index]["type"] !== "application/pdf" && (!files[index]["type"].includes("image/"))) {
            toast.error("Invalid File Type. Please upload with valid File Format.");
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            setInputFile(() => [
                { id: 0, src: e.target.result }
            ]);
        };

        reader.readAsDataURL(files[index]);
        return files[index];
    }

    // handle drag events
    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }

    // triggers when file is dropped
    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files);
        }
    }


    // triggers when file is selected with click
    const handleChange = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files);
        }
    };


    // triggers the input when the button is clicked
    const onButtonClick = () => {
        inputRef.current.click();
    };

    if (docInfo?.length === 0 || state.docInfo?.length === 0) {
        return <></>;
    }

    return (
        <div className="font-medium min-h-[100vh] w-[100%] h-[100%]">
            <header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[60px]">

                <Link to="/dashboard/home"><CloseBtn /></Link>

                <p className="text-xl -mr-3">Upload {docInfo.code}</p>

                <div className="mr-3">
                    Step <strong>{parseInt((parseInt(file) * 2)) - 1}</strong> out of <strong>{(parseInt(state.docInfo.length) * 2) + 2}</strong>
                </div>
            </header>
            <main className="m-auto">
                <div className="flex justify-center">

                    <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                        <input ref={inputRef} type="file" style={{ display: "none" }} multiple={false} onChange={handleChange} />
                        <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : ""}>
                            <div>
                                <img src={FileUploadIcon} alt="Upload File" style={{ maxHeight: "230px", display: "block", margin: "0 auto 20px" }} />
                                <p className="text-xl text-[#999999] font-medium">Drag & Drop Your {docInfo.code} Here</p>
                                <p> or </p>
                                <button className="upload-kyb-button mt-2" onClick={onButtonClick}>Choose file</button>
                                <p className="mt-5 text-base text-[#999999]">File format should be PDF or JPG or JPEG or PNG or WEBP</p>
                            </div>
                        </label>

                        {dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
                    </form>


                </div>
            </main>

        </div>
    );
}
