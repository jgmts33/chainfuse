import { Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Container sx={{ my: 4 }}>
      <Typography sx={{ mb: 2, fontSize: "1.5rem" }} variant="h2">
        Nothing to see here!
      </Typography>
      <Typography>
        <Link to="/">Go to the home page of the app</Link>
      </Typography>
    </Container>
  );
}

export { NotFound };
