import { ChainFuseRoot } from "@chainfuse/ui";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./common/App.js";
import "./core/polyfills.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChainFuseRoot>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChainFuseRoot>
  </React.StrictMode>
);
