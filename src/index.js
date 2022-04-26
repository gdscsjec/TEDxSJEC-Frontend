import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import LoadingState from "./context/loadingState";
import "./styles/global.home.css";

ReactDOM.render(
  <LoadingState>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </LoadingState>,
  document.getElementById("root")
);
