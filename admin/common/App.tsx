import { Box, CssBaseline, ThemeProvider, Toolbar } from "@mui/material";
import * as React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useSignInRedirect } from "../core/auth.js";
import { auth } from "../core/firebase.js";
import { currentUser } from "../core/state.js";
import Hostnames from "../routes/Hostnames.js";
import Login from "../routes/Login.js";
import Sites from "../routes/Sites.js";
import Users from "../routes/Users.js";
import * as theme from "../theme/index.js";
import { AppDrawer } from "./AppDrawer.js";
import { AppToolbar } from "./AppToolbar.js";
import { Authorized } from "./Authorized.js";
import ErrorBoundary from "./ErrorBoundary.js";
import { NotFound } from "./NotFound.js";

function App(): JSX.Element {
  const [me, setCurrentUser] = useRecoilState(currentUser);
  const location = useLocation();
  useSignInRedirect();

  const isLoginPage = location.pathname === "/admin/login";
  const showDrawer = !isLoginPage && !!me;

  // Update the currently logged in user object whenever
  // the authentication state changes
  React.useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  }, []);

  return (
    <ThemeProvider theme={theme.light}>
      <CssBaseline />
      <AppToolbar />
      {showDrawer && <AppDrawer />}
      <Box
        sx={{
          flexGrow: 1,
          ml: showDrawer ? "260px" : undefined,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
        component="main"
      >
        <Toolbar />
        <ErrorBoundary>
          <Routes>
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<Navigate to="/admin/users" />} />
            <Route
              path="/admin/users"
              element={<Authorized to={<Users />} />}
            />
            <Route
              path="/admin/sites"
              element={<Authorized to={<Sites />} />}
            />
            <Route
              path="/admin/hostnames"
              element={<Authorized to={<Hostnames />} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Box>
    </ThemeProvider>
  );
}

export { App };
