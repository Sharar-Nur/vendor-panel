import React from "react";
import IncompleteProfileStepsContext from "../context/IncompleteProfileStepsContext";
import PostLoginGetApi from "../api/PostLoginGetApi";



class IncompleteProfileStepsContextProvider extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isLoad: false,
            isError: false,
            isProfileComplete: false,
            isEmailVerified: false,
            data: null
        };
    }

    componentDidUpdate(prevProps) {
        
        if(prevProps.isChange === undefined) {
            return;
        }

        const arr = Object.keys(prevProps.isChange);
        for(let i=0; i<arr.length; i++) {
            if(prevProps.isChange[arr[i]] === this.props?.isChange[arr[i]]) {
                continue;
            }
            
            
            this.componentDidMount();
            return;
        }

        return;
    }


    componentDidMount = async () => {
        try {
            await PostLoginGetApi("user/profile-status").then((responseJSON)=>{
                let response = JSON.stringify(responseJSON);
                response = JSON.parse(response);

                if(response["status"]===1) {
                    let responseData = JSON.stringify(response["data"]);
                    responseData = JSON.parse(responseData);
                    if(responseData["code"]===200) {

                        this.setState({data: responseData["data"]});
                        if(responseData.data.account_approval===true && responseData.data.business_details===true && responseData.data.business_details_documents === true && responseData.data.complete_profile===true && responseData.data.owner_nid===true && responseData.data.owner_photo === true ) {
                            this.setState({isProfileComplete: true});
                        }

                        if(responseData.data.is_mail_verified===true) {
                            this.setState({isEmailVerified:true});
                        }

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
                <IncompleteProfileStepsContext.Provider value={{value: this.state}}>
                    {this.props.children}
                </IncompleteProfileStepsContext.Provider>
            );
        }
    }

}

export default IncompleteProfileStepsContextProvider;