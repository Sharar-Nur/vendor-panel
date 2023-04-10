
import React, {useEffect, useState, useRef, useContext} from "react";
import {ReactComponent as CloseBtn} from '../../../../assets/icons/close.svg';
import { Link, useNavigate } from 'react-router-dom';
import Button from "./components/Button";
import "../../../../components/FileUpload/style.css";
import FileUploadIcon from "../../../../assets/icons/UploadFileIcon.png";
import WarningIcon from '../../../../assets/icons/warning.png';

import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostLoginPostApi from "../../../../components/api/PostLoginPostApi";
import RootContext from "../../../../components/context/RootContext";

const CompleteProfileStep1 = () => {

    const RootContextValue = useContext(RootContext);

    const [uploadFile, setUploadFile] = useState({});
    const [nidPdf, setNidPdf] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);
    
    let navigate = useNavigate();

    useEffect(()=>{
        window.history.replaceState({}, "");
        if(nidPdf.length === 0) {
            return;
        }

        
        navigate("/dashboard/complete-profile-step2", {
            state: {
                nidPdf: nidPdf[0].src,
                uploadFile: uploadFile
            }
        });

    },[nidPdf]);


    function handleFile(files) {
        var index = files.length-1;

        if(files[index]["type"] !== "application/pdf") {
            toast.error("Invalid File Type. Please upload valid PDF File.");
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            setNidPdf(() => [
                { id: 0, src: e.target.result }
            ]);
        };

        reader.readAsDataURL(files[index]); 
        return files[index]; 
    }

    // handle drag events
    const handleDrag = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // triggers when file is dropped
    const handleDrop = function(e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setUploadFile(e.dataTransfer.files[0]);
            handleFile(e.dataTransfer.files);
        }
    };


    // triggers when file is selected with click
    const handleChange = function(e) {
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

    let handleSkip = async () => {
        
        await PostLoginPostApi("api/v1/auth/skip/representative_info", "", 0).then((responseJSON)=>{
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if(response["status"]===1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if(responseData["code"]===200) {
                    toast.success("Representative Information skip successfully.");
                    RootContextValue.forceUpdate("presentativeDetails");
                    return navigate("/dashboard/home");
                }

                toast.error(responseData["messages"].toString());
                return;
            }

            toast.error("A problem occur while sending skip request. Please try again.");

        }).catch((error)=>{
            toast.error("A problem occur. Please try again.");
            console.log(error);
        });

        return;
    }
    
    
    return (
        <div className="font-medium min-h-[100vh] w-[100%] h-[100%]">
            <header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[60px]">
                <Link to="/dashboard/home"><CloseBtn /></Link>
                <p className="text-xl -mr-3">Upload Representative's NID</p>
                <div className="mr-3" onClick={handleSkip}>
                    <Button  name="Skip" bg_clr="primary" font_color="white" />
                </div>
            </header>
            <main className="m-auto">
                <div className="flex justify-center ">
                    
                    <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                        <input ref={inputRef} type="file" style={{display: "none"}} multiple={false} onChange={handleChange} />
                    
                        <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" } >
                            <div>
                                <img src={FileUploadIcon} alt="Upload NID" style={{maxHeight:"230px", display: "block", margin: "0 auto 20px"}} />
                                <p className="text-xl text-[#999999] font-medium">Drag & Drop Representative's NID Here</p>
                                <p> or </p>
                                <button className="upload-kyb-button mt-2" onClick={onButtonClick}>Choose file</button>
                                <p className="mt-5 text-base text-[#999999]">File format should be .pdf</p>
                                
                            </div>
                        </label>


                        <div className="flex justify-center mt-6">
                            <img src={WarningIcon} alt="warning icon" style={{width: '17.49px', height: '16px'}} />
                            <p className="not-italic font-normal text-base leading-4 text-left pl-3" style={{width: '500px', height: '16px', color: '#666666'}}>Note: If you have no representative, Please skip this step.</p>
                        </div>

                        { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
                    </form>
                

                </div>
            </main>
        </div>
    );
};

export default CompleteProfileStep1;