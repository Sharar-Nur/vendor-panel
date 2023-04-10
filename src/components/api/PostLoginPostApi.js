const CryptoJS = require("crypto-js");

var PostLoginPostApi = async (API_END_POINT = "", REQUEST_BODY = "", IS_PREFIX_NEED = 1, NO_NEED_DEFAULT_CT = 0, IS_PATCH = 0) => {
    let arr = { status: 0 };

    try {

        let api_url = process.env.REACT_APP_API_BASE_URL;
        if (IS_PREFIX_NEED === 1) {
            api_url += process.env.REACT_APP_API_PREFIX_PRIVATE;
        }

        var decryptData = JSON.parse(CryptoJS.AES.decrypt(window.localStorage.getItem("UserToken"), process.env.REACT_APP_SECURITY_SALT).toString(CryptoJS.enc.Utf8));

        let headerArr = {
            'Authorization': 'Bearer ' + decryptData.token,
            'Accept': 'application/json'
        };

        if (NO_NEED_DEFAULT_CT === 0) {
            headerArr["Content-Type"] = "application/json";
        }


        let method = "POST";
        if (IS_PATCH === 1) {
            method = "PATCH";
        }
        else if (IS_PATCH === 2) {
            method = "PUT";
        }
        else if (IS_PATCH === 3) {
            method = "DELETE";
        }


        await fetch(api_url + API_END_POINT, {
            method: method,
            headers: new Headers(headerArr),
            body: REQUEST_BODY
        })
            .then(res => res.json())
            .then((result) => {
                arr['status'] = 1;
                arr['data'] = result;
            }, (error) => {
                arr['data'] = error;
            }
        );
    }
    catch (err) {
        arr['data'] = err;
    }
    finally {
        if (arr["data"]["code"] === 401) {
            document.location.href = "/dashboard/logout";
            return;
        }
        return arr;
    }
}

export default PostLoginPostApi;

