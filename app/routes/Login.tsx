import { useCurrentUser, useGoogleSignIn } from "@chainfuse/react";
import { Alert, Box, Button, Container } from "@mui/material";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoUrl from "../assets/images/logos/svg/google.svg";
import { Google } from "../icons/Google.js";

export default function Login(): JSX.Element {
  const [signIn, error] = useHandleSignIn();
  useRedirectAuthenticated();

  return (
    <Container
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      maxWidth="xs"
    >
      {/* LOGO */}
      <Box sx={{ mb: 4 }} component="img" src={logoUrl} />

      {/* ERROR */}
      {error && <Alert sx={{ mb: 2 }} severity="error" children={error} />}

      <p>
        Signing up means you are accepting the &nbsp;
        <a href="#">Terms of services</a> and <a href="#">Privacy Policy</a>
      </p>

      {/* BUTTON(s) */}
      <Button
        sx={{ mb: 2 }}
        variant="contained"
        color="primary"
        children="Sign in via Google"
        onClick={signIn}
        startIcon={<Google sx={{ mr: 1 }} />}
        size="large"
      />
    </Container>
  );
}

function useHandleSignIn() {
  const [error, setError] = React.useState<string>();
  const location = useLocation();
  const navigate = useNavigate();
  const signIn = useGoogleSignIn();

  return [
    React.useCallback(
      async (event: React.MouseEvent) => {
        event.preventDefault();
        setError(undefined);
        try {
          await signIn();
          const from = (location.state as { from: Location })?.from;
          navigate(from ?? "/", { replace: true });
        } catch (err) {
          setError((err as Error)?.message ?? "Login failed");
        }
      },
      [location.key, signIn]
    ),
    error,
  ] as const;
}

/**
 * Redirects an authenticated user from the login page
 * to the customer dashboard.
 */
export function useRedirectAuthenticated() {
  const me = useCurrentUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (me) {
      navigate("/templates");
    }
  }, [me, navigate]);
}
