const postFetchApi = async (endpoint, body, headerFlag = null, token = null) => {

    let response;

    const base_url = process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_PREFIX;
    const final_url = base_url + endpoint;
    let headerObject = {}

    if(headerFlag)
    {
        headerObject = {
            'Content-type': 'application/json',
        }
    }
    if(token)
    {
        headerObject['Token'] = 'Bearer ' + token;
    }


    await fetch(final_url, {
        method: 'POST',

        headers: headerObject,

        body: body
    })
    .then((res) => {
        response = res;
    })
    return response;
}



export default postFetchApi;