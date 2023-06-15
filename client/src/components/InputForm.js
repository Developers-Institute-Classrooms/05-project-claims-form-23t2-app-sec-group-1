import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const InputForm = () => {
  const { getAccessTokenSilently } = useAuth0();
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
  const [captchaValue, setCaptchaValue] = useState("");
  const navigate = useNavigate();

  const resetForm = () => {
    setPolicyNumber("");
    setCustomerId("");
    setConditionClaimedFor("");
    setSymptomsDetails("");
    setMedicalServiceType("");
    setServiceProviderName("");
    setOtherInsuranceProvider(true);
    setIsChecked(false);
    setError(false);
    setStartDate(new Date());
  };

  const onChange = (value) => {
    console.log(value);
    setCaptchaValue(value);
  };

  const onSubmit = async (event) => {
    if (!captchaValue) {
      alert("Please complete Captcha Verification and try again.");
      return resetForm();
    }
    const accessToken = await getAccessTokenSilently();
    event.preventDefault();
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
        captcha: captchaValue,
      };
      const accessToken = await getAccessTokenSilently();

      const response = await fetch(
        `${process.env.REACT_APP_API_SERVER_URL}/api/form`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        if (error.error === "Duplicate Entry") {
          alert("Duplicate Entry, You have already filed this claim.");
          return resetForm();
        }
        if (error.error === "Invalid customer ID or policy number") {
          alert("Invalid customer ID or policy number");
          return resetForm();
        }
        if (error.message === "Validation failed") {
          alert("Validation Failed, Please check your details and try again");
          return resetForm();
        } else {
          setError(true);
          return;
        }
      } else {
        alert("Submission Successfully Added!");
        navigate("/dashboard");
        return;
      }
    } catch (err) {
      setError(true);
    }
  };
  if (error) {
    return (
      <div className="claims-form">
        <p className="errorMessage">
          Oops, something went wrong! Please refresh this page to re-fill the
          claim form.
        </p>
      </div>
    );
  }
  return (
    <>
      <form className="claims-form" onSubmit={onSubmit}>
        <h1 className="formTitle">Insurance Claims Form</h1>
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
        <label htmlFor="startDate">Beginning of Observed Condition</label>
        <div className="datePicker" data-testid="datePicker">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            maxDate={new Date()}
            id={new Date()}
          />
        </div>
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
          <span>By submitting this form, I consent to the following:</span>
          <p className="disclaimer-paragraph">
            "As part of an insurance claim with enSURE, I consent and give
            authority to enSURE and any of its related entities and agents to
            collect, use and disclose, any medical, financial or other personal
            information about the life assured for the purposes of assessing and
            managing the insurance claim. I declare that all medical information
            pertaining to me and relevant to my insurance claim has been
            provided and disclosed to enSURE, and understand that making any
            false or fraudulent claim could result in cancellation of my policy
            and/or oblige me to repay any claims."
          </p>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked((prev) => !prev)}
            id="consent"
          />
          <label htmlFor="consent">I consent</label>
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_CAPTCHA}
            onChange={onChange}
          />
          ,
        </div>
        <input type="submit" className="btn-success" />
      </form>
    </>
  );
};

export default InputForm;
