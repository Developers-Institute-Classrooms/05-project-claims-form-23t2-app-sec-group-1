import ensureLogo from "../images/ensure-logo.svg";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "./client-login-button";
import { LogoutButton } from "./logout-button";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const { isAuthenticated } = useAuth0();
  const location = useLocation();

  return (
    <div className="header">
      <header>
        <img src={ensureLogo} alt="enSURE Logo" className="App-logo"></img>
        <div className="nav-bar__buttons">
          {!isAuthenticated && (
            <>
              <LoginButton />
            </>
          )}
          {isAuthenticated && (
            <>
              {location.pathname === "/dashboard" && (
                <Link to="/">
                  <button className="btn-nav-homepage" type="button">
                    Homepage
                  </button>
                </Link>
              )}
              {location.pathname !== "/dashboard" && (
                <Link to="/dashboard">
                  <button className="btn-nav-dashboard" type="button">
                    Dashboard
                  </button>
                </Link>
              )}
              <LogoutButton />
            </>
          )}
        </div>
        <hr className="primary-divider" align="left"></hr>
      </header>
    </div>
  );
};

export default Header;
