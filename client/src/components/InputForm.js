import React, { Fragment, useState } from "react";

const InputForm = () => {
  const [description, setDescription] = useState("");

  const onSubmit = async () => {
    try {
      const body = { description };

      await fetch(`${process.env.REACT_APP_API_URL}/form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5">Form</h1>
      <div className="d-flex mt-5">
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn btn-success" onClick={onSubmit}>
          Add
        </button>
      </div>
    </Fragment>
  );
};

export default InputForm;
