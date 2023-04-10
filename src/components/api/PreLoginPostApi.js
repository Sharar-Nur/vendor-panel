var PreLoginPostApi = async (API_END_POINT="", REQUEST_BODY="") => {
    let arr = {status: 0};

    try {
        await fetch(process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_PREFIX + API_END_POINT, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),

            body: REQUEST_BODY
        })
        .then(res => res.json())
        .then((result)=>{
                arr['status'] = 1;
                arr['data'] = result;
            },(error)=>{
                arr['data'] = error;
            }
        );
    }
    catch(err) {
        arr['data'] = err;
    }
    finally {
        return arr;
    }
}

export default PreLoginPostApi;

