import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [startDate, setStartDate] = useState(new Date());

  const onSubmit = async () => {
    try {
      const body = {
        policy_number: policyNumber,
        customer_id: customerId,
        condition_claimed_for: conditionClaimedFor,
        first_symptoms_date: startDate,
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
    <form className="grid" onSubmit={onSubmit}>
      <h1 className="text-center mt-5">Form</h1>

      <label htmlFor="policyNumber">Policy Number</label>
      <input
        id="policyNumber"
        type="text"
        className="form-control"
        value={policyNumber}
        onChange={(e) => setPolicyNumber(e.target.value)}
        required
      />
      <label htmlFor="customerId">Customer Id</label>
      <input
        id="customerId"
        type="text"
        className="form-control"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        required
      />
      <label htmlFor="conditionClaimedFor">Condition Claimed For</label>
      <input
        id="conditionClaimedFor"
        type="text"
        className="form-control"
        value={conditionClaimedFor}
        onChange={(e) => setConditionClaimedFor(e.target.value)}
        required
      />
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        maxDate={new Date()}
        placeholderText="Select a date after 5 days ago"
      />

      <label htmlFor="symptomDetails">Symptom Details</label>
      <input
        id="symptomDetails"
        type="text"
        className="form-control"
        value={symptomsDetails}
        onChange={(e) => setSymptomsDetails(e.target.value)}
        required
      />
      <label htmlFor="medicalServiceType">Medical Service Type</label>
      <input
        id="medicalServiceType"
        type="text"
        className="form-control"
        value={medicalServiceType}
        onChange={(e) => setMedicalServiceType(e.target.value)}
        required
      />
      <label htmlFor="serviceProviderName">Service Provider Name</label>
      <input
        id="serviceProviderName"
        type="text"
        className="form-control"
        value={serviceProviderName}
        onChange={(e) => setServiceProviderName(e.target.value)}
        required
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
            required
          />
          <span>I consent to the following</span>
        </label>
      </div>

      <input type="submit" />
    </form>
  );
};

export default InputForm;
