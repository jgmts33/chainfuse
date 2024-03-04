import {
  AppBar as AppBarBase,
  AppBarProps as AppBarPropsBase,
  Toolbar,
  Typography,
} from "@mui/material";

export function AppBar(props: AppBarProps): JSX.Element {
  const { sx, ...other } = props;

  return (
    <AppBarBase
      sx={{ borderBottom: "1px solid", borderBottomColor: "divider" }}
      color="inherit"
      elevation={0}
      {...other}
    >
      <Toolbar>
        <Typography sx={{ fontSize: "1.5rem" }} variant="h1">
          Company
        </Typography>
      </Toolbar>
    </AppBarBase>
  );
}

type AppBarProps = Omit<AppBarPropsBase, "children">;
