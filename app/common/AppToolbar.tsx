import { useCurrentUser } from "@chainfuse/react";
import { ConnectWallet } from "@chainfuse/ui";
import { Menu } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Hidden,
  IconButton,
  Link,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import * as React from "react";
import { Link as Lnk } from "react-router-dom";
import logoUrl from "../assets/images/logos/svg/google.svg";
import logoSmallUrl from "../icons/logo-84x48.png";
import { UserMenu, useUserMenu } from "../menus/UserMenu.js";
import { useToggleDrawer } from "./Drawer.js";
import { ProjectSelect } from "./ProjectSelect.js";

export function AppToolbar(): JSX.Element {
  const toggleDrawer = useToggleDrawer();
  const userIconRef = React.useRef(null);
  const userMenu = useUserMenu(userIconRef);
  const me = useCurrentUser();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <AppBar color="default" elevation={10}>
      <Toolbar>
        <IconButton sx={{ mr: 2 }} children={<Menu />} onClick={toggleDrawer} />
        {/* LOGO */}
        <Link sx={{ maxHeight: 24, mr: 2 }} component={Lnk} to="/">
          <Box
            sx={{
              width: "100%",
              height: "100%",
              maxHeight: 24,
              ...(!smUp && { width: 42, height: 24 }),
            }}
            component="img"
            src={smUp ? logoUrl : logoSmallUrl}
          />
        </Link>

        {/* WORKSPACE */}
        <Hidden only={["xs", "sm"]}>
          <ProjectSelect sx={{ maxWidth: 250 }} />
        </Hidden>

        <Box component="span" sx={{ flexGrow: 1 }} />

        <ConnectWallet />

        {me && (
          <IconButton sx={{ p: "4px" }} onClick={userMenu.open}>
            <Avatar
              sx={{ width: 36, height: 36 }}
              ref={userIconRef}
              src={me.photoURL ?? undefined}
              alt={me.displayName ?? undefined}
            />
          </IconButton>
        )}
      </Toolbar>
      <UserMenu />
    </AppBar>
  );
}
