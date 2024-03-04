import { Box, Container, Divider, Link, Typography } from "@mui/material";

function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      style={{ flex: "auto", margin: "auto" }}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://chainfuse.com/">
        ChainFuse
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: "auto",
      }}
    >
      <Container sx={{ pt: 3, pb: 3 }}>
        <Divider sx={{ mb: 3 }} />
        <div style={{ display: "flex", flex: "0 0 100%" }}>
          <Copyright />
          <div style={{ display: "flex", gap: "16px" }}>
            <Link href="#" variant="body2" underline="hover">
              Privacy Policy
            </Link>
            <Link href="#" variant="body2" underline="hover">
              Term of Services
            </Link>
          </div>
        </div>
      </Container>
    </Box>
  );
}
