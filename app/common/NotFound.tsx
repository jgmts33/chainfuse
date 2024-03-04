import { Container, Typography } from "@mui/material";

export function NotFound(): JSX.Element {
  return (
    <Container>
      <Typography sx={{ fontSize: "1.5rem" }} variant="h2">
        Page Not Found
      </Typography>
    </Container>
  );
}
