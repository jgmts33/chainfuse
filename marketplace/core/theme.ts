import { createTheme } from "@mui/material";
import { components } from "./components.js";

const { palette } = createTheme({
  palette: {
    divider: "#e6e8f0",
  },
});

/**
 * Customized Material UI theme
 * @see https://mui.com/material-ui/customization/default-theme/
 */
export const theme = createTheme({
  palette,
  components: components(palette),
});
