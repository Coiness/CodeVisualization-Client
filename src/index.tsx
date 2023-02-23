import React from "react";
import ReactDOM from "react-dom/client";
import { test } from "./core/diff/objDiff";
import "./index.css";
import App from "./view/App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

function execTest() {
  test();
}

const useTest = false;

if (useTest) {
  execTest();
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
