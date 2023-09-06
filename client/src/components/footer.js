import ensureSymbol from "../images/ensure-symbol.svg";
import privacyStatement from "../images/PrivacyStatement.pdf";

const footer = () => {
  return (
    <div className="footer">
      <footer>
        <hr className="primary-divider" align="right"></hr>
        <img src={ensureSymbol} alt="enSURE Symbol" className="App-icon"></img>
        <p className="footerText">Keeping the unexpected, uncomplicated</p>
        <a href={privacyStatement} className="privacy-statement">
          Privacy Statement
        </a>
      </footer>
    </div>
  );
};

export default footer;
