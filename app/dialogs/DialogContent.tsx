import {
  DialogContent as Content,
  DialogContentProps,
  Typography,
} from "@mui/material";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";

export function DialogContent(props: DialogContentProps): JSX.Element {
  const { children, ...other } = props;
  return (
    <Content {...other}>
      <ErrorBoundary
        fallback={<Typography component="span">Oops, something went wrong</Typography>}
        children={<React.Suspense fallback="Loading..." children={children} />}
      />
    </Content>
  );
}
