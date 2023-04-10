import React from "react";
import RegistrationRequiredBusinessDocumentsContext from "../context/RegistrationRequiredBusinessDocumentsContext";
import PostLoginGetApi from "../api/PostLoginGetApi";



class RegistrationRequiredBusinessDocumentsContextProvider extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            isLoad: false,
            isError: false,
            data: null,
            docArr: []
        };
    }


    componentDidMount = async () => {

        try {
            await PostLoginGetApi("api/v1/business/owner-type", "", 0).then((responseJSON)=>{
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if(response["status"]===1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);
                    if(responseData["code"]===200) {
                        
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                        const tempDocListArr = responseData["data"]["owner_types"]?.filter(data => data?.id === this.props.organizationType);
                        if(tempDocListArr?.length === 1) {
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                            this.setState({docArr:  tempDocListArr[0]["docs"]});
                        }

                        this.setState({data: responseData["data"]["owner_types"]});
                        return;
                    }
                }
            });
        }
        catch(exception) {
            this.setState({isError: true});
            console.log(exception);
        }
        finally {
            this.setState({isLoad: true});
        }
    }



    render = () => {
        if(this.state.isLoad === true) {
            return (
                <RegistrationRequiredBusinessDocumentsContext.Provider value={{value: this.state}}>
                    {this.props.children}
                </RegistrationRequiredBusinessDocumentsContext.Provider>
            );
        }
    }

}

export default RegistrationRequiredBusinessDocumentsContextProvider;