import { Dns, Person, Web } from "@mui/icons-material";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import * as theme from "../theme/index.js";

function AppDrawer(): JSX.Element {
  const { pathname: path } = useLocation();

  return (
    <ThemeProvider theme={theme.dark}>
      <Drawer
        sx={{
          flexShrink: 0,
          zIndex: (theme) => theme.zIndex.appBar - 1,
          "& .MuiDrawer-paper": {
            width: 260,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={true}
      >
        <Toolbar />
        <List sx={{ mt: 2 }}>
          <ListItem disablePadding>
            <ListItemButton
              sx={{ pl: 3 }}
              component={Link}
              to="/admin/users"
              selected={
                path === "/admin/users" || path.startsWith("/admin/users/")
              }
            >
              <ListItemIcon sx={{ minWidth: 38 }} children={<Person />} />
              <ListItemText primary="Users" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              sx={{ pl: 3 }}
              component={Link}
              to="/admin/sites"
              selected={
                path === "/admin/sites" || path.startsWith("/admin/sites/")
              }
            >
              <ListItemIcon sx={{ minWidth: 38 }} children={<Web />} />
              <ListItemText primary="Websites" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              sx={{ pl: 3 }}
              component={Link}
              to="/admin/hostnames"
              selected={
                path === "/admin/hostnames" ||
                path.startsWith("/admin/hostnames/")
              }
            >
              <ListItemIcon sx={{ minWidth: 38 }} children={<Dns />} />
              <ListItemText primary="Hostnames" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </ThemeProvider>
  );
}

export { AppDrawer };
