import React, { Fragment } from "react";
import "./index.css";
import ensureLogo from "./images/ensure-logo.svg";

//components

import InputForm from "./components/InputForm";

function App() {
  return (
    <Fragment>
      <div className="header">
        <header>
          <img src={ensureLogo} alt="enSURE Logo" className="App-logo"></img>
          <hr className="header-divider" align="left"></hr>
        </header>
      </div>
      <div className="primary-container">
        <InputForm />
      </div>
      <div className="footer">
        <img src={ensureLogo} alt="enSURE Logo" className="Footer-logo"></img>
        <p>Keeping the unexpected, uncomplicated</p>
      </div>
    </Fragment>
  );
}

export default App;
