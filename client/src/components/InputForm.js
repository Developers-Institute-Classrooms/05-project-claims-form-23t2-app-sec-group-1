import { React, Fragment, useState } from "react";
import DatePicker from "react-datepicker";

const InputForm = () => {
  const [policyNumber, setPolicyNumber] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [conditionClaimedFor, setConditionClaimedFor] = useState("");
<<<<<<< HEAD
  const [startDate, setStartDate] = useState(new Date());
  const [symptomsDetails, setSymptomsDetails] = useState("");
  const [medicalServiceType, setMedicalServiceType] = useState("");
  const [serviceProviderName, setServiceProviderName] = useState("");
  const [otherInsuranceProvider, setOtherInsuranceProvider] = useState("");
=======
  const [symptomsDetails, setSymptomsDetails] = useState("");
  const [medicalServiceType, setMedicalServiceType] = useState("");
  const [serviceProviderName, setServiceProviderName] = useState("");
  const [otherInsuranceProvider, setOtherInsuranceProvider] = useState(true);
>>>>>>> ad2a4df (Update input form - guy, mitchell, angus)
  const [isChecked, setIsChecked] = useState(false);

  const onSubmit = async () => {
    try {
      const body = {
        policy_number: policyNumber,
        customer_id: customerId,
        condition_claimed_for: conditionClaimedFor,
        first_symptoms_date: "date",
        symptoms_details: symptomsDetails,
        medical_service_type: medicalServiceType,
        service_provider_name: serviceProviderName,
        other_insurance_provider: otherInsuranceProvider,
        consent: isChecked,
      };

      await fetch(`${process.env.REACT_APP_API_URL}/form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5">Form</h1>
      <div className="d-flex mt-5">
        <label htmlFor="policyNumber">Policy Number</label>
        <input
          id="policyNumber"
          type="text"
          className="form-control"
          value={policyNumber}
          onChange={(e) => setPolicyNumber(e.target.value)}
        />
<<<<<<< HEAD
        <input
=======
        <label htmlFor="customerId">Customer Id</label>
        <input
          id="customerId"
>>>>>>> ad2a4df (Update input form - guy, mitchell, angus)
          type="text"
          className="form-control"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />
<<<<<<< HEAD
        <input
=======
        <label htmlFor="conditionClaimedFor">Condition Claimed For</label>
        <input
          id="conditionClaimedFor"
>>>>>>> ad2a4df (Update input form - guy, mitchell, angus)
          type="text"
          className="form-control"
          value={conditionClaimedFor}
          onChange={(e) => setConditionClaimedFor(e.target.value)}
        />
<<<<<<< HEAD
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
        <input
=======
        <label htmlFor="symptomDetails">Symptom Details</label>
        <input
          id="symptomDetails"
>>>>>>> ad2a4df (Update input form - guy, mitchell, angus)
          type="text"
          className="form-control"
          value={symptomsDetails}
          onChange={(e) => setSymptomsDetails(e.target.value)}
        />
<<<<<<< HEAD
        <input
=======
        <label htmlFor="medicalServiceType">Medical Service Type</label>
        <input
          id="medicalServiceType"
>>>>>>> ad2a4df (Update input form - guy, mitchell, angus)
          type="text"
          className="form-control"
          value={medicalServiceType}
          onChange={(e) => setMedicalServiceType(e.target.value)}
        />
<<<<<<< HEAD

        <input
=======
        <label htmlFor="serviceProviderName">Service Provider Name</label>
        <input
          id="serviceProviderName"
>>>>>>> ad2a4df (Update input form - guy, mitchell, angus)
          type="text"
          className="form-control"
          value={serviceProviderName}
          onChange={(e) => setServiceProviderName(e.target.value)}
        />
<<<<<<< HEAD

        <select
=======
        <label htmlFor="otherInsuranceProvider">Other Insurance Provider</label>
        <select
          id="otherInsuranceProvider"
>>>>>>> ad2a4df (Update input form - guy, mitchell, angus)
          className="selectBox"
          value={otherInsuranceProvider}
          onChange={(e) => setOtherInsuranceProvider(e.target.value)}
        >
          <option value="true">Yes I have another insurance provider</option>
          <option value="false">No enSure is my only insurance provider</option>
        </select>

        <div className="checkbox-wrapper">
          <label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked((prev) => !prev)}
            />
            <span>I conesnt to the following</span>
          </label>
        </div>

        <button className="btn btn-success" onClick={onSubmit}>
          Add
        </button>
      </div>
    </Fragment>
  );
};

export default InputForm;
