import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as CloseBtn } from '../../../assets/icons/close.svg'
import BlackButton from '../../../components/BlackButton';
import { toast } from 'react-toastify';
import PostLoginPostApi from '../../../components/api/PostLoginPostApi';

const StoreEditCategory = () => {

    const state = useLocation();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [id, setId] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();

        if(id==="") {
            toast.error("No category id found.");
            return;
        } 

        if(name===""){
            toast.error("Please enter category name.");
            return;
        }

        // CALL API
        PostLoginPostApi("shop/category/"+id, JSON.stringify({name: name}), 1, 0, 2).then((responseJSON)=>{
            let response = JSON.stringify(responseJSON);
            response = JSON.parse(response);

            if(response["status"]===1) {
                let responseData = JSON.stringify(response["data"]);
                responseData = JSON.parse(responseData);

                if(responseData["code"] === 200) {
                    toast.success("Category update successfully.");
                    navigate("/dashboard/store", { state: {
                        tab: "store-category"
                    }});
                    return;
                }

                toast.error("A problem occur. Please try again.");
            }
        }).catch((error)=>{
            console.log(error);
        });
    }

    useEffect(()=>{
        console.log(state?.state);
        if(state?.state?.data?.id === undefined) {
            return navigate("/dashboard/store", { state: {
                tab: "store-category"
            }});
        }

        if(state?.state?.data?.name === undefined) {
            return navigate("/dashboard/store", { state: {
                tab: "store-category"
            }});
        }

        setId(state.state.data.id);
        setName(state.state.data.name);
    },[state]);

    return (
        <div className="font-medium min-h-[100vh] w-[100%] h-[100%] custom-container-left custom-scroll-auto">
            <header className="p-4 border-b-2 border-dark-white mb-[60px]">
                <Link to="/dashboard/store" state={{tab: "store-category"}}><CloseBtn className="float-left" /></Link>
                <p className="text-center">Update Category</p>
            </header>
            <main className="max-w-2xl m-auto">
                
                <h1 className="text-xl">Category Name</h1>
                <form onSubmit={onSubmit}>
                    <div className="my-[15px]">
                        <input type="text" name="name" placeholder="Enter Category Name" value={name} onChange={(event)=>setName(event.currentTarget.value)} className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" />
                    </div>
                    <BlackButton name="Update Category" />
                </form>

            </main>
        </div>
    );
};

export default StoreEditCategory;