import { CssBaseline } from "@mui/material";
import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Layout } from "./Layout.js";
import { NotFound } from "./NotFound.js";
import { ThemeProvider } from "./ThemeProvider.js";

// #region Route Components
// @ts-ignore
const Templates = React.lazy(() => import("../routes/Templates.js"));
// @ts-ignore
const Login = React.lazy(() => import("../routes/Login.js"));
// @ts-ignore
const SiteDetails = React.lazy(() => import("../routes/SiteDetails.js"));
// @ts-ignore
const SiteDomain = React.lazy(() => import("../routes/SiteDomain.js"));
// @ts-ignore
const Onboard = React.lazy(() => import("../routes/Onboard.js"));

// #endregion

export function App(): JSX.Element {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/templates" />} />
          <Route
            path="templates"
            element={<React.Suspense children={<Templates />} />}
          />
          <Route path="sites">
            <Route index element={<Navigate to="/" replace />} />
            <Route
              path=":id"
              element={<React.Suspense children={<SiteDetails />} />}
            />
            <Route
              path=":id/domain"
              element={<React.Suspense children={<SiteDomain />} />}
            />
          </Route>
        </Route>
        <Route path="/login" element={<Onboard />} />
        <Route path="/onboard" element={<Onboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}
