import { Alert, Button, Container, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useGoogleSignIn } from "../core/auth.js";

export default function Login(): JSX.Element {
  const location = useLocation();
  const signIn = useGoogleSignIn();
  const error = (location.state as { error?: string })?.error;

  return (
    <Container
      sx={{
        py: 4,
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
      maxWidth="xs"
    >
      <Typography
        sx={{ fontSize: "1.5rem", mb: 2 }}
        variant="h2"
        children="ChainFuse Admin"
      />
      {error && (
        <Alert
          sx={{ alignSelf: "stretch", mb: 2 }}
          severity="error"
          children={error}
        />
      )}
      <Button
        sx={{ mb: "10vh" }}
        variant="outlined"
        color="primary"
        children="Sign In via Google"
        onClick={signIn}
        fullWidth
      />
    </Container>
  );
}
