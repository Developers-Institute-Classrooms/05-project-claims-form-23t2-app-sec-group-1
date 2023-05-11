import React, { Fragment, useState } from "react";

const InputForm = () => {
  const [policyNumber, setPolicyNumber] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [conditionClaimedFor, setConditionClaimedFor] = useState("");
  const [symptomsDetails, setSymptomsDetails] = useState("");
  const [medicalServiceType, setMedicalServiceType] = useState("");
  const [serviceProviderName, setServiceProviderName] = useState("");
  const [otherInsuranceProvider, setOtherInsuranceProvider] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(false);

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

      const response = await fetch(`${process.env.REACT_APP_API_URL}/form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        setError(true);
        return;
      }

      window.location = "/";
    } catch (err) {
      console.error(err.message);
      setError(true);
    }
  };
  if (error) {
    return <p>Oops, something went wrong!</p>;
  }
  return (
    <Fragment>
      <h1 className="text-center mt-5">Insurance Claims Form</h1>
      <div className="claims-form">
        <label htmlFor="policyNumber">Policy Number</label>
        <input
          id="policyNumber"
          type="text"
          className="form-control"
          value={policyNumber}
          onChange={(e) => setPolicyNumber(e.target.value)}
        />
        <label htmlFor="customerId">Customer Id</label>
        <input
          id="customerId"
          type="text"
          className="form-control"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />
        <label htmlFor="conditionClaimedFor">Condition Claimed For</label>
        <input
          id="conditionClaimedFor"
          type="text"
          className="form-control"
          value={conditionClaimedFor}
          onChange={(e) => setConditionClaimedFor(e.target.value)}
        />
        <label htmlFor="symptomDetails">Symptom Details</label>
        <input
          id="symptomDetails"
          type="text"
          className="form-control"
          value={symptomsDetails}
          onChange={(e) => setSymptomsDetails(e.target.value)}
        />
        <label htmlFor="medicalServiceType">Medical Service Type</label>
        <input
          id="medicalServiceType"
          type="text"
          className="form-control"
          value={medicalServiceType}
          onChange={(e) => setMedicalServiceType(e.target.value)}
        />
        <label htmlFor="serviceProviderName">Service Provider Name</label>
        <input
          id="serviceProviderName"
          type="text"
          className="form-control"
          value={serviceProviderName}
          onChange={(e) => setServiceProviderName(e.target.value)}
        />
        <label htmlFor="otherInsuranceProvider">Other Insurance Provider</label>
        <select
          id="otherInsuranceProvider"
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
