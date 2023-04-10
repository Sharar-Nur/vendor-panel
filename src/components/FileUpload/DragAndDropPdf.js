import React, {useEffect, useState, useRef} from "react";
import "./style.css";
import PdfGrid from "./ImageGrid";
import FileUploadIcon from "./../../assets/icons/UploadFileIcon.png";



// drag drop file component
function DragAndDropPdf() {

    const [pdf, setPdf] = useState([]);

    // drag state
    const [dragActive, setDragActive] = useState(false);
    // ref
    const inputRef = useRef(null);
    

    useEffect(()=>{
        if(pdf.length === 0) {
            return;
        }

    },[pdf]);


    function handleFile(files) {
        var index = files.length-1;

        if(files[index]["type"] !== "application/pdf") {
            alert("Invalid File Type. Please upload PDF only");
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            setPdf((prevState) => [
                // ...prevState,
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
            handleFile(e.dataTransfer.files);
        }
    };


    // triggers when file is selected with click
    const handleChange = function(e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files);
        }
    };


    // triggers the input when the button is clicked
    const onButtonClick = () => {
        inputRef.current.click();
    };


    return (
        <>
            <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                <input ref={inputRef} type="file" style={{display: "none"}} multiple={false} onChange={handleChange} />
                <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
                    <div>
                        <img src={FileUploadIcon} alt="Upload NID" style={{maxHeight:"230px", display: "block", margin: "0 auto 20px"}} />
                        <p className="text-xl text-[#999999] font-medium">Drag & Drop Owner’s NID Here</p>
                        <p> or </p>
                        <button className="upload-kyb-button mt-2" onClick={onButtonClick}>Choose file</button>
                        <p className="mt-5 text-base text-[#999999]">File format should be .pdf</p>
                    </div>
                </label>


                { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
            </form>

            {/* <PdfGrid images={pdf} /> */}
        </>
    );
};

export default DragAndDropPdf;
