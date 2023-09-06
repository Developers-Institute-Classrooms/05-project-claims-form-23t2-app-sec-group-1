import "./index.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { Routes, Route } from "react-router-dom";
import InputForm from "./components/InputForm";
import Dashboard from "./components/dashboard";
import Homepage from "./components/homepage";
import ProfilePage from "./components/ProfilePage";
import { AuthenticationGuard } from "./auth/AuthenticationGuard";

function App() {
  return (
    <>
      <Header />
      <div className="primary-container">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/dashboard"
            element={<AuthenticationGuard component={Dashboard} />}
          />
          <Route
            path="/claim"
            element={<AuthenticationGuard component={InputForm} />}
          />
          <Route
            path="/profile"
            element={<AuthenticationGuard component={ProfilePage} />}
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
