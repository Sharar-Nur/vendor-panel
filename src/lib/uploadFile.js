const CryptoJS = require("crypto-js");

const uploadFile = async (api_end_point, uploadFile, fileTitle, doc_type) => {

    let arr = { status: 0 };

    let fileData = new FormData();
    fileData.append(fileTitle, uploadFile);
    if (doc_type) {
        fileData.append("verification_doc_type", doc_type);
    }

    let decryptData = JSON.parse(CryptoJS.AES.decrypt(window.localStorage.getItem("UserToken"), process.env.REACT_APP_SECURITY_SALT).toString(CryptoJS.enc.Utf8));

    let api_url = process.env.REACT_APP_API_BASE_URL;
    try {
        await fetch(api_url + api_end_point, {
            method: "POST",
            headers: new Headers({
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + decryptData.token
            }),
            body: fileData
        })
            .then(res => res.json())
            .then((result) => {
                arr['status'] = 1;
                arr['data'] = result;
            }, (err) => arr['data'] = err)
    }
    catch (err) {
        arr['data'] = err;
    } finally {
        if (arr["data"]["code"] === 401) {
            document.location.href = "/dashboard/logout";
            return;
        }
        return arr;
    }


}

export default uploadFile;