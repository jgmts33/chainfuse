import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import * as React from "react";
import { Route, Routes } from "react-router-dom";
import { theme } from "../core/theme.js";
import { Home } from "../routes/index.js";

export function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<React.Suspense children={<Home />} />} />
      </Routes>
    </ThemeProvider>
  );
}
