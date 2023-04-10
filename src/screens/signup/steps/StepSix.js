import React, { useEffect, useState, useRef, useTransition } from 'react';
import { ToastContainer, toast } from 'react-toastify';
// import { useForm } from 'react-hook-form';
import Button from '../../../components/Button';
import { useNavigate, useLocation } from "react-router-dom";
import preLoginGetApi from '../../../components/api/PreLoginGetApi';
import { ImArrowRight2 } from "react-icons/im";

const StepSix = () => {

    const { state } = useLocation();

    const [businessCategories, setBusinessCateories] = useState('');
    const [businessError, setBusinessError] = useState(null);
    const [isBusinessLoaded, setIsBusinessLoaded] = useState(false);


    const [ownerTypes, setOwnerTypes] = useState('');
    const [ownerErrors, setOwnerErrors] = useState(null);
    const [isOwnerLoaded, setIsOwnerLoaded] = useState(false);
    const [isPending, startTransition] = useTransition();



    const [bc, setBc] = useState('Choose from all categories');
    const [owner, setOwner] = useState('Choose from all type of organization');





    useEffect(() => {
        if (state === null || state.accept === "" || state.accept === undefined || state.accept === null
            || state.mobile_number === "" || state.mobile_number === undefined || state.mobile_number === null
            || state.email === "" || state.email === undefined || state.email === null
            || state.name === "" || state.name === undefined || state.name === null
            || state.otp === "" || state.otp === undefined || state.otp === null) {
            window.history.replaceState({}, "");
            navigate('/signup/step-one');
            return;
        }
    }, [])


    //both together
    useEffect(() => {
        try {
            preLoginGetApi("api/v1/business/owner-type").then((res) => {
                setIsOwnerLoaded(true);

                if (res['status'] === 1) {
                    setOwnerTypes(res['data']['data']);
                    return;
                }
                setOwnerErrors(res['data']);
            })
        } catch (err) {
            toast.error(err);
            console.log(err.message);
        }


        startTransition(() => {
            try {
                preLoginGetApi("api/v1/business/categories")
                    .then((res) => {
                        setIsBusinessLoaded(true);

                        if (res['status'] === 1) {
                            setBusinessCateories(res['data']['data']);
                            return;
                        }
                        setBusinessError(res['data']);
                    })
            } catch (err) {
                toast.error(err);
                console.log(err.message);
            }
        });

    }, [])



    let navigate = useNavigate();

    const onSubmit = (event) => {
        event.preventDefault();
        navigate('/signup/step-seven', {
            state: {
                mobile_number: state.mobile_number,
                name: state.name,
                email: state.email,
                accept: state.accept,
                otp: state.otp,
                organization_type_id: owner,
                business_category_id: bc
            }
        })
    };



    const goBack = () => {
        navigate('/signup/step-five', {
            state: {
                otp: state.otp,
                mobile_number: state.mobile_number,
                name: state.name,
                email: state.email
            }
        })
    }

    return (
        <div className="w-3/5">
            <ToastContainer />
            <h1 className="font-bold text-4xl mb-8">Organization Type & Category</h1>
            <div className="bg-neutral-100 p-9 text-secondary ">
                <form onSubmit={onSubmit} className="form-body" autoComplete='off'>
                    <div className="mb-2">
                        <label htmlFor="typeOfOrg" className="block mb-3">Select Type of Organization</label>
                        <select className="w-full mb-2.5 rounded border-solid border border-dark-white" value={owner} onChange={(e) => setOwner(e.target.value)} required>
                            <option value=""  >Choose from all type of organization</option>
                            {
                                ownerTypes?.owner_types?.map(type => {
                                    return <option key={type.id} value={type.id} className="text-secondary">{type.name}</option>
                                })
                            }

                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="businessCategory" className="block mb-3">Business Category</label>
                        <select className="w-full mb-2.5 rounded border-solid border border-dark-white" value={bc} onChange={(e) => setBc(e.target.value)} required>
                            <option value="">Choose from all categories</option>
                            {
                                isPending ? "loading..." :
                                    businessCategories?.categories?.map(category => {
                                        return <option key={category.id} value={category.id} className="text-secondary">{category.name}</option>
                                    })
                            }

                        </select>
                    </div>
                    <Button />
                    <p onClick={goBack} className="cursor-pointer"><span  className="font-bold text-primary"><ImArrowRight2 className='inline ml-1 mb-0.5 rotate-180' /> Go Back?</span> </p>
                </form>
            </div>
        </div>
    );

}
export default StepSix;


