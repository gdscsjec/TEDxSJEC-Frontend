import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import LoadingState from "./context/loadingState";
import "./styles/global.home.css";

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <LoadingState>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </LoadingState>
);
