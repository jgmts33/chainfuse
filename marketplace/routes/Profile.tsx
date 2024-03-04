import { Container, Typography } from "@mui/material";
import { ProfileInfo } from "../common/ProfileInfo.js";

export default function Profile(): JSX.Element {
  return (
    <Container sx={{ my: 4 }}>
      <ProfileInfo></ProfileInfo>
    </Container>
  );
}
