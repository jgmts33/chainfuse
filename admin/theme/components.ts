import { Palette, ThemeOptions } from "@mui/material";

export default (() => ({
  MuiCssBaseline: {
    styleOverrides: {
      "#root": { display: "flex" },
    },
  },

  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
      },
    },
  },
})) as (palette: Palette) => ThemeOptions["components"];
