import React, { useState, useEffect, useContext, useTransition } from "react";
import { ReactComponent as CloseBtn } from './../../../../assets/icons/close.svg';
import { Link, useNavigate } from 'react-router-dom';
import BlackButton from "../../../../components/BlackButton";
import PostLoginPostApi from "../../../../components/api/PostLoginPostApi";
import $ from "jquery";

// Context
import UserBasicInfoContext from "./../../../../components/context/UserBasicInfoContext";
import RegistrationRequiredBusinessDocumentsContext from "./../../../../components/context/RegistrationRequiredBusinessDocumentsContext";
import IncompleteProfileStepsContext from "../../../../components/context/IncompleteProfileStepsContext";

// API Components
import PostLoginGetApi from "../../../../components/api/PostLoginGetApi";

import { toast } from 'react-toastify';
import RootContext from "../../../../components/context/RootContext";

const BusinessDetails = (props) => {
	const rootContextValue = useContext(RootContext);

	const [inputs, setInputs] = useState({});
	const [isBusinessNameChecked, setIsBusinessNameChecked] = useState(true);
	const [isAddressChecked, setIsAddressChecked] = useState(false);

	const [division, setDivision] = useState("");
	const [district, setDistrict] = useState("");
	const [thanaOrUpazilla, setThanaOrUpazilla] = useState("");
	const [businessBank, setBusinessBank] = useState("");
	const [businessBranch, setBusinessBranch] = useState("");
	const [natureOfBusiness, setNatureOfBusiness] = useState("");
	const [netAssetRange, setNetAssetRange] = useState("");
	const [estMonthlyTransaction, setEstMonthlyTransaction] = useState("");
	const [noOfMonthlyTransaction, setNoOfMonthlyTransaction] = useState("");
	const [accNumber, setAccNumber] = useState("")

	const [isPending, startTransition] = useTransition();


	const requiredDocs = useContext(RegistrationRequiredBusinessDocumentsContext);



	let navigate = useNavigate();


	const IncompleteProfileSteps = useContext(IncompleteProfileStepsContext);



	const handleInputs = (e) => {
		const name = e.target.name;
		const value = e.target.value;

		if (name === "estMaxAmountInSingleTransaction") {
			const re = /^[0-9]*(\.[0-9]{0,2})?$/;
			if (value !== '' && !re.test(value)) {
				return;
			}
		}

		setInputs(values => ({ ...values, [name]: value }))
	}

	const handleBusinessNameCheckbox = () => {
		setIsBusinessNameChecked(!isBusinessNameChecked);
		if (isBusinessNameChecked === true) {
			$("#businessName").attr("required", true);
			setInputs({ ...inputs, businessName: "" });
			return;
		}

		$("#businessName").attr("required", false);
		setInputs({ ...inputs, businessName: UserBasicInfoValue?.name });
	}

	const handleAddressCheckbox = () => {
		setIsAddressChecked(!isAddressChecked);
		setInputs(values => ({ ...values, presentAddress: "", postcode: "" }))
		$("#present-address-div").find("select").val("");


		if (isAddressChecked === false) {
			$("#present-address-div").find("input").attr("required", false);
			$("#present-address-div").find("select").attr("required", false);
			$("#present-address-div").slideUp(1000);
			return;
		}


		$("#present-address-div").find("input").attr("required", true);
		$("#present-address-div").find("select").attr("required", true);

		$("#present-address-div").slideDown(1000);
	}

	// USE CONTEXT
	const [businessAccountName, setBusinessAccountName] = useState("");
	const UserBasicInfoValue = useContext(UserBasicInfoContext);
	useEffect(() => {
		setInputs({ ...inputs, businessName: UserBasicInfoValue?.name });
		setBusinessAccountName(UserBasicInfoValue?.name);
	}, [UserBasicInfoValue?.name]);


	// Get Bank, Division Information
	const [bankList, setBankList] = useState([]);
	const [divisionList, setDivisionList] = useState([]);
	const [tempAddressDropdown, setTempAddressDropdown] = useState([]);

	const [natureOfBusinessList, setNatureOfBusinessList] = useState([]);

	const [riskFactors, setRiskFactors] = useState({
		net_asset_range: [],
		monthly_transaction_volume: [],
		monthly_transaction_number: []
	});


	useEffect(() => {
		startTransition(() => {
			// Get Bank 
			PostLoginGetApi("banks").then((responseJSON) => {
				let response = JSON.stringify(responseJSON);
				response = JSON.parse(response);

				if (response["status"] === 1) {
					let responseData = JSON.stringify(response["data"]);
					responseData = JSON.parse(responseData);

					setBankList(responseData["data"]["banks"]);
				}
			});
		});
	}, []);


	useEffect(() => {
		startTransition(() => {
			// Get Division & District & PS
			PostLoginGetApi("api/v1/division_district_thana_list", "", 0).then((responseJSON) => {
				let response = JSON.stringify(responseJSON);
				response = JSON.parse(response);

				if (response["status"] === 1) {
					let responseData = JSON.stringify(response["data"]);
					responseData = JSON.parse(responseData);

					if (responseData["code"] === 200) {
						setTempAddressDropdown(responseData["data"]);
						setDivisionList(responseData["data"]["divisions"]);
					}
				}
			});
		});

	}, []);


	useEffect(() => {

		// Get Nature of Business
		PostLoginGetApi("api/v1/business/natures", "", 0).then((responseJSON) => {
			let response = JSON.stringify(responseJSON);
			response = JSON.parse(response);

			if (response["status"] === 1) {
				let responseData = JSON.stringify(response["data"]);
				responseData = JSON.parse(responseData);

				if (responseData["code"] === 200) {
					setNatureOfBusinessList(responseData["data"]["business_natures"]);
				}

			}
		});


		// Get Risk Factors
		PostLoginGetApi("api/v1/business-details/risk-policies", "", 0).then((responseJSON) => {
			let response = JSON.stringify(responseJSON);
			response = JSON.parse(response);

			if (response["status"] === 1) {
				let responseData = JSON.stringify(response["data"]);
				responseData = JSON.parse(responseData);

				if (responseData["code"] === 200) {
					setRiskFactors({ ...riskFactors, net_asset_range: responseData["data"]["net_asset_range"], monthly_transaction_volume: responseData["data"]["monthly_transaction_volume"], monthly_transaction_number: responseData["data"]["monthly_transaction_number"] });
				}
			}
		});


	}, []);


	const [districtList, setDistrictList] = useState([]);
	const chooseDivision = (e) => {
		setDivision(e.target.value);

		if (tempAddressDropdown["districts"].length > 0) {
			let result = tempAddressDropdown["districts"].filter(data => parseInt(data.division_id) === parseInt(e.target.value));
			setDistrictList(result);

			$("#districts, #thanas").val("");
			setPsList([]);
			return;
		}


		setDistrictList([]);
	}


	const [psList, setPsList] = useState([]);
	const chooseDistrict = (e) => {
		setDistrict(e.target.value);

		if (tempAddressDropdown["thanas"].length > 0) {
			let result = tempAddressDropdown["thanas"].filter(data => parseInt(data.district_id) === parseInt(e.target.value));
			setPsList(result);

			$("#thanas").val("");
		}
	}


	// Get Bank Branch Information
	const [bankBranchList, setBankBranchList] = useState([]);
	useEffect(() => {

		$("#businessBranches").val("");
		if (businessBank === undefined || businessBank === "") {
			return;
		}

		PostLoginGetApi("api/v1/bank/branches", ({ bank_id: businessBank }), 0).then((responseJSON) => {
			let response = JSON.stringify(responseJSON);
			response = JSON.parse(response);

			if (response["status"] === 1) {
				let responseData = JSON.stringify(response["data"]);
				responseData = JSON.parse(responseData);

				setBankBranchList(responseData["data"]["branches"]);
			}
		});

	}, [businessBank]);


	// Required DOCS....
	const [requireDocArr, setRequireDocArr] = useState([]);
	useEffect(() => {
		if (requiredDocs?.value?.isLoad === true && requiredDocs?.value?.isError === false) {
			setRequireDocArr(requiredDocs?.value?.docArr);
		}
	}, [requiredDocs, requiredDocs?.value]);


	const [stepChecked, isStepChecked] = useState(false);
	useEffect(() => {
		isStepChecked(true);



		if (requireDocArr.length === 0) {
			return;
		}

		if (IncompleteProfileSteps?.value?.data?.business_details === true) {
			let arr = {};
			arr.business_owner_type_id = props.organizationType;
			arr.business_category_id = props.businessCategory;
			window.localStorage.setItem("UploadedArr", JSON.stringify(arr));

			// toast.success("Verified Business Details already submitted.");
			return navigate("/dashboard/business-details-upload-documents/1", {
				state: {
					docInfo: requireDocArr

				}
			});
		}

	}, [requireDocArr]);



	const submitFormData = (event) => {
		event.preventDefault();

		const businessDetails = {};

		businessDetails.business_name = inputs.businessName;
		businessDetails.is_same_name = true;
		if (!isBusinessNameChecked) {
			businessDetails.is_same_name = false;
		}


		businessDetails.address_info = {
			address: inputs.presentAddress || "",
			division_id: division || "",
			district_id: district || "",
			thana_id: thanaOrUpazilla || "",
			post_code: inputs.postcode || ""
		}

		businessDetails.is_same_address = true;
		if (!isAddressChecked) {
			businessDetails.is_same_address = false;
		}

		businessDetails.bank_info = {
			account_name: businessAccountName,
			account_no: accNumber,
			bank_id: businessBank,
			branch_id: businessBranch
		};

		businessDetails.transaction_profile = {
			business_nature_id: natureOfBusiness,
			net_asset_range_id: netAssetRange,
			monthly_transaction_volume_id: estMonthlyTransaction,
			monthly_transaction_number_id: noOfMonthlyTransaction,
			highest_volume: parseFloat(inputs.estMaxAmountInSingleTransaction).toFixed(2)
		}

		PostLoginPostApi('api/v1/upload/business-details', JSON.stringify(businessDetails), 0, 0).then((resJSON) => {
			let res = JSON.stringify(resJSON);
			res = JSON.parse(res);

			if (res["status"] === 1) {
				let resData = JSON.stringify(res["data"]);
				resData = JSON.parse(resData);

				if (resData["code"] === 200 || resData["code"] === 201) {


					toast.success("Verified Business Details successfully.");
					rootContextValue.forceUpdate('businessDetails1');

					if (requireDocArr?.length === 0) {
						return navigate("/dashboard/home");
					}

					let arr = {};
					arr.business_owner_type_id = props.organizationType;
					arr.business_category_id = props.businessCategory;
					window.localStorage.setItem("UploadedArr", JSON.stringify(arr));

					return navigate("/dashboard/business-details-upload-documents/1", {
						state: {
							docInfo: requireDocArr
						}
					});

				}

				toast.error(resData["messages"].toString());
				return;
			}


			toast.error("A problem occur. Please try again.");
		});
		setAccNumber('');
	}


	if (stepChecked === false) {
		return <div className="font-medium min-h-[100vh] w-[100%] h-[100%] custom-container-left custom-scroll-auto">Please wait. Checking..</div>
	}

	const accNumberHandler = (event) => {
        const result = event.target.value.replace(/\D/g, '');
        setAccNumber(result)
    }



	return (
		<div className="font-medium min-h-[100vh] w-[100%] h-[100%] custom-container-left custom-scroll-auto">
			<div className="font-medium pb-[60px]">
				<header className="flex justify-between items-center p-4 border-b-2 border-dark-white mb-[60px]">
					<Link to="/dashboard/home"><CloseBtn /></Link>
					<p className="text-xl text-black ">Provide Business Details</p>
					<div></div>
				</header>
				<main className="max-w-3xl m-auto">
					<div className="flex justify-center ">
						<form action='' method='POST' className="w-full" onSubmit={(event) => submitFormData(event)} >
							<h3 className="text-xl mb-[15px]">Doing Business Name as</h3>
							<div>
								<input type="text" id="businessName" name="businessName" value={inputs.businessName || ""} onChange={handleInputs} placeholder="Enter Doing Business Name" disabled={isBusinessNameChecked} className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" />
							</div>

							<div className="mb-[30px] ">
								<div className="mr-[30px] flex items-center">
									<input type="checkbox" id="is_business_name_same" name="businessCheck" value="businessCheck" checked={isBusinessNameChecked} onChange={handleBusinessNameCheckbox} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
									<label htmlFor="is_business_name_same" className="text-secondary cursor-pointer">Doing business name same as Trade License business name</label>
								</div>
							</div>


							<h3 className="text-xl mb-[15px]">Present Address</h3>
							<div id="present-address-div">
							
								<div>
									<input type="text" id="presentAddress" name="presentAddress" value={inputs.presentAddress || ""} onChange={handleInputs} placeholder="Present Address" disabled={isAddressChecked} className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" required />
								</div>

								<div className="flex justify-between mb-[15px]" >
									<select name="division" id="division" defaultValue="" disabled={isAddressChecked} onChange={(event) => chooseDivision(event)} className="w-[49%] rounded border-solid border border-dark-white" required>
										<option value="" disabled>Choose Division</option>
										{(isPending === false) && divisionList.map(val => (
											<option key={val?.id} value={val?.id} className="text-black">{val?.name}</option>
										))}
									</select>

									<select name="districts" id="districts" defaultValue="" disabled={isAddressChecked} onChange={(event) => chooseDistrict(event)} className="w-[49%] rounded border-solid border border-dark-white" required>
										<option value="" disabled>Choose District/City</option>
										{(districtList.length > 0) && districtList.map(val => (
											<option key={val?.id} value={val?.id} className="text-black">{val?.name}</option>
										))}
									</select>
								</div>


								<div className="flex justify-between mb-[15px]" >
									<select name="thanas" id="thanas" defaultValue="" disabled={isAddressChecked} onChange={(e) => setThanaOrUpazilla(e.target.value)} className="w-[49%] rounded border-solid border border-dark-white" required>
										<option value="" disabled>Choose Police Station / Thana</option>
										{(psList.length > 0) && psList.map(val => (
											<option key={val?.id} value={val?.id} className="text-black">{val?.name}</option>
										))}

									</select>
									<input type="text" id="postcode" name="postcode" value={inputs.postcode || ""} disabled={isAddressChecked} onChange={handleInputs} placeholder="Post Code" className="w-[49%] rounded border-solid border border-dark-white placeholder:text-ash" required />
								</div>
							</div>

							<div className="flex mb-[30px]">
								<div className="mr-[30px] flex items-center">
									<input type="checkbox" id="addressCheck" name="addressCheck" value="addressCheck" checked={isAddressChecked} onChange={handleAddressCheckbox} className="mr-2.5 text-primary focus:ring-primary border-dark-white" />
									<label htmlFor="addressCheck" className="text-secondary cursor-pointer">Present address same as provided in trade license</label>
								</div>
							</div>


							<h3 className="text-xl mb-[15px]">Bank Details</h3>
							<div>
								<input type="text" name="businessAccountName" id="businessAccountName" value={businessAccountName} title="Your Business Account Name" placeholder="Your Business Account Name" className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" disabled />
							</div>

							<div className="flex justify-between mb-[15px]" >
								<select name="businessBanks" id="businessBanks" defaultValue="" onChange={(e) => setBusinessBank(e.target.value)} className="w-[49%] rounded border-solid border border-dark-white" required>
									<option value="" disabled>Choose Bank Name</option>
									{(isPending === false) && bankList.map(val => (
										<option key={val?.bank_id} value={val?.bank_id} className="text-black">{val?.bank_name}</option>
									))}
								</select>

								<select name="businessBranches" id="businessBranches" onChange={(e) => setBusinessBranch(e.target.value)} className="w-[49%] rounded border-solid border border-dark-white" defaultValue="" required>
									<option value="" disabled>Choose Branch Name</option>
									{(isPending === false) && bankBranchList.map(val => (
										<option key={val?.branch_id} value={val?.branch_id} className="text-black">{val?.name}</option>
									))}
								</select>
							</div>
							<div>
								<input type="text" name="businessBankAccountNumber" value={accNumber || ""} onChange={accNumberHandler} placeholder="Account Number" className="w-full mb-2.5 rounded border-solid border border-dark-white placeholder:text-ash" required />
							</div>


							<h3 className="text-xl mt-[15px] mb-[15px]">Transaction Profile</h3>


							<select name="natureOfBusiness" id="natureOfBusiness" defaultValue="" onChange={(e) => setNatureOfBusiness(e.target.value)} className="w-full rounded border-solid border border-dark-white mb-[15px]" required>
								<option value="" disabled>Choose Nature of Business</option>
								{(isPending === false) && natureOfBusinessList.map(val => (
									<option key={val?.id} value={val?.id} className="text-black">{val?.name}</option>
								))}

							</select>

							<div className="flex justify-between mb-[15px]" >
								<select name="netAssetRange" id="netAssetRange" defaultValue="" onChange={(e) => setNetAssetRange(e.target.value)} className="w-[49%] rounded border-solid border border-dark-white" required>
									<option value="" disabled>Net Asset Range</option>
									{(isPending === false) && riskFactors.net_asset_range.map(val => (
										<option key={val?.id} value={val?.id} className="text-black">{val?.name}</option>
									))}
								</select>

								<select name="estMonthlyTransaction" id="estMonthlyTransaction" defaultValue="" onChange={(e) => setEstMonthlyTransaction(e.target.value)} className="w-[49%] rounded border-solid border border-dark-white" required>
									<option value="" disabled>Est. Monthly Transaction</option>
									{(isPending === false) && riskFactors.monthly_transaction_volume.map(val => (
										<option key={val?.id} value={val?.id} className="text-black">{val?.name}</option>
									))}
								</select>
							</div>


							<div className="flex justify-between mb-[15px]" >
								<select name="estNoOfMonthlyTransaction" id="estNoOfMonthlyTransaction" defaultValue="" onChange={(e) => setNoOfMonthlyTransaction(e.target.value)} className="w-[49%] rounded border-solid border border-dark-white" required>
									<option value="" disabled>Est. No. of Transaction Per Month</option>
									{(isPending === false) && riskFactors.monthly_transaction_number.map(val => (
										<option key={val?.id} value={val?.id} className="text-black">{val?.name}</option>
									))}
								</select>



								<input type="text" id="estMaxAmountInSingleTransaction" name="estMaxAmountInSingleTransaction" value={inputs.estMaxAmountInSingleTransaction || ""} onChange={handleInputs} title="Estimate/Approximately highest amount in single transaction" placeholder="Est. Highest Amount in a Single Transaction" className="w-[49%] rounded border-solid border  border-dark-white placeholder:text-ash" required />

							</div>

							<BlackButton name="Next" />

						</form>
					</div>
				</main>
			</div>

			<style>{`
				* :disabled {
					background-color: #F5F5F5 !important;
				}

			`}</style>

		</div>

	);
};

export default BusinessDetails;