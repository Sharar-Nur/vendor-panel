const preLoginGetApi = async (API_END_POINT="", API_PREFIX="0") => {
    let arr = {status: 0};

    try {
        let endPoint;
        if(API_PREFIX === "0" || API_PREFIX === 0){
            endPoint = process.env.REACT_APP_API_BASE_URL + API_END_POINT;
        }else{
            endPoint = process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_PREFIX + API_END_POINT;
        }
        await fetch(endPoint, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
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

export default preLoginGetApi;

