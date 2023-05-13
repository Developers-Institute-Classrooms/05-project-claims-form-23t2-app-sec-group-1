import React, { Fragment } from "react";
import "./index.css";
import ensureLogo from "./images/ensure-logo.svg";
import ensureSymbol from "./images/ensure-symbol.svg";

//components

import InputForm from "./components/InputForm";

function App() {
  return (
    <Fragment>
      <div className="header">
        <header>
          <img src={ensureLogo} alt="enSURE Logo" className="App-logo"></img>
          <hr className="primary-divider" align="left"></hr>
        </header>
      </div>
      <div className="primary-container">
        <InputForm />
      </div>
      <div className="footer">
        <footer>
          <hr className="primary-divider" align="right"></hr>
          <img
            src={ensureSymbol}
            alt="enSURE Symbol"
            className="App-icon"
          ></img>
          <p className="footerText">Keeping the unexpected, uncomplicated</p>
        </footer>
      </div>
    </Fragment>
  );
}

export default App;
