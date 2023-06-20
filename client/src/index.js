import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0ProviderWithNavigate } from "./auth/auth0-provider-with-navigate";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
);
