import { Palette, ThemeOptions } from "@mui/material";

export default ((palette) => ({
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: "rgb(156 158 177)",
      },
    },
  },

  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        background: "#f9f9f9",
      },
    },
  },

  MuiListItemButton: {
    styleOverrides: {
      root: {
        paddingTop: "4px",
        paddingBottom: "4px",

        "&:hover": {
          color: palette.text.primary,
          backgroundColor: "#f5f5f5",
        },
        "&:active": {
          backgroundColor: "#e1e1e1",
        },
        "&.Mui-selected,&.Mui-selected:hover": {
          color: palette.secondary.main,
          backgroundColor: "#e8f0fe",
        },
      },
    },
  },
})) as (palette: Palette) => ThemeOptions["components"];
