import { createTheme, PaletteOptions, Theme } from "@mui/material";
import components from "./components.js";
import * as palettes from "./palettes.js";

function theme(paletteOptions: PaletteOptions): Theme {
  const { palette } = createTheme({ palette: paletteOptions });

  const theme = createTheme({
    palette: paletteOptions,
    components: components(palette),
  });

  if (palette.mode === "light") {
    theme.shadows.forEach((value, i) => {
      theme.shadows[i] = value
        .replace("0.2", "0.08")
        .replace("0.14", "0.05")
        .replace("0.12", "0.04");
    });
  }

  return theme;
}

export const light = theme(palettes.light);
export const dark = theme(palettes.dark);
