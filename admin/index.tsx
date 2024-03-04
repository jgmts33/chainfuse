/* SPDX-FileCopyrightText: 2020-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { LicenseInfo } from "@mui/x-license-pro";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { App } from "./common/App.js";

LicenseInfo.setLicenseKey(
  "abdfa6e823587df102574505ff4dabf0Tz01MDk1NSxFPTE2OTQ4ODMyMDMzODIsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI="
);

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>
);
