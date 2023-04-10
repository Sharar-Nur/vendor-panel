const CryptoJS = require("crypto-js");

var PostLoginGetApi = async (API_END_POINT = "", REQUEST_BODY = "", IS_PREFIX_NEED = 1) => {
    let arr = { status: 0 };

    try {
        let api_url = process.env.REACT_APP_API_BASE_URL;
        if (IS_PREFIX_NEED === 1) {
            api_url += process.env.REACT_APP_API_PREFIX_PRIVATE;
        }
        const decryptData = JSON.parse(CryptoJS.AES.decrypt(window.localStorage.getItem("UserToken"), process.env.REACT_APP_SECURITY_SALT).toString(CryptoJS.enc.Utf8));
        await fetch(api_url + API_END_POINT + "?" + new URLSearchParams(REQUEST_BODY).toString(), {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded",
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + decryptData.token
            })
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

export default PostLoginGetApi;

