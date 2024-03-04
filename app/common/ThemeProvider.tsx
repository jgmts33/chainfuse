import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import * as React from "react";
import * as themes from "../theme/index.js";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider(props: ThemeProviderProps): JSX.Element {
  return <MuiThemeProvider theme={themes.light} {...props} />;
}
