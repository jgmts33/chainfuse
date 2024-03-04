import { Box, Container, Typography } from "@mui/material";
import * as React from "react";

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      error: undefined,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override componentDidCatch(err: Error, info: React.ErrorInfo) {
    console.error(err, info);
  }

  override render() {
    if (this.state.error) {
      return (
        <Container sx={{ py: 4 }}>
          <Typography sx={{ fontSize: "1.5rem" }} variant="h2">
            Something went wrong! We have been notified.
          </Typography>
          <Box component="pre">
            <code>{this.state.error.stack}</code>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}
