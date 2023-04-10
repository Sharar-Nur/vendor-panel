import React, { useEffect, useState, useRef, useContext } from "react";
import { ReactComponent as CloseBtn } from './../../../assets/icons/close.svg';
import { Link, useNavigate } from 'react-router-dom';
import "./../../../components/FileUpload/style.css";
import FileUploadIcon from "./../../../assets/icons/UploadFileIcon.png";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import IncompleteProfileStepsContext from "../../../components/context/IncompleteProfileStepsContext";

const UploadInvoice = () => {
    // let navigate = useNavigate();
    // const IncompleteProfileSteps = useContext(IncompleteProfileStepsContext);

    // useEffect(() => {
    //     // if (IncompleteProfileSteps?.value?.data?.owner_nid === true) {
    //     //     navigate("/dashboard/verify-identity-step-three", {
    //     //         state: {
    //     //             nid: "done"
    //     //         }
    //     //     })
    //     // }
    // }, [])


    const [uploadFile, setUploadFile] = useState({});
    const [pdf, setPdf] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);


    useEffect(() => {
        window.history.replaceState({}, "");
        if (pdf.length === 0) {
            return;
        }

        // navigate("/dashboard/verify-identity-step-two", {
        //     state: {
        //         pdf: pdf[0].src,
        //         uploadFile: uploadFile
        //     }
        // });

    }, [pdf]);


    function handleFile(files) {
        var index = files.length - 1;

        if (files[index]["type"] !== "application/pdf") {
            toast.error("Invalid File Type. Please upload valid PDF File.");
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            setPdf(() => [
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
    };

    // triggers when file is dropped
    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files);
            setUploadFile(e.dataTransfer.files[0]);
        }
    };


    // triggers when file is selected with click
    const handleChange = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setUploadFile(e.target.files[0]);
            handleFile(e.target.files);
        }
    };


    // triggers the input when the button is clicked
    const onButtonClick = () => {
        inputRef.current.click();
    };
    return (
        <div className="font-medium min-h-[100vh] w-[100%] h-[100%]">
            <header className="flex items-center p-4 border-b-2 border-dark-white mb-[60px]">
                <Link to="/dashboard/invoice"><CloseBtn /></Link>
                <p className="text-xl text-center w-full">Upload Bulk Invoice</p>
                {/* <div className="mr-3">
                    Step <strong>1</strong> out of <strong>2</strong>
                </div> */}
            </header>
            <main className="m-auto">
                <div className="flex justify-center ">

                    <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                        <input ref={inputRef} type="file" style={{ display: "none" }} multiple={false} onChange={handleChange} />
                        <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : ""}>
                            <div>
                                <img src={FileUploadIcon} alt="Upload Invoice" style={{ maxHeight: "230px", display: "block", margin: "0 auto 20px" }} />
                                <p className="text-xl text-[#999999] font-medium">Drag & Drop Invoices Here</p>
                                <p> or </p>
                                <button className="upload-kyb-button mt-2" onClick={onButtonClick}>Choose file</button>
                                <p className="mt-5 text-base text-[#999999]">File format should be .xlsx</p>
                            </div>
                        </label>


                        {dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
                    </form>

                </div>
            </main>
        </div>
    );
};

export default UploadInvoice;