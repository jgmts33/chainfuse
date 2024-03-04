import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Toolbar,
} from "@mui/material";
import * as React from "react";
import { Link } from "react-router-dom";
import { useCurrentUser, useGoogleSignIn } from "../core/auth.js";
import logoUrl from "../icons/logo.svg";
import { UserMenu } from "../menus/UserMenu.js";

function AppToolbar(): JSX.Element {
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const userIconRef = React.useRef(null);
  const me = useCurrentUser();
  const signIn = useGoogleSignIn();

  function toggleUserMenu() {
    setUserMenuOpen((prev) => !prev);
  }

  function closeUserMenu() {
    setUserMenuOpen(false);
  }

  return (
    <AppBar color="inherit" elevation={10}>
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          component={Link}
          to="/admin/"
        >
          <Box sx={{ height: "24px" }} component="img" src={logoUrl} />
        </Box>

        <Box sx={{ flexGrow: 1 }} component="span" />

        {me && (
          <IconButton
            ref={userIconRef}
            sx={{ p: "2px" }}
            onClick={toggleUserMenu}
          >
            <Avatar
              alt={me.displayName ?? undefined}
              src={me.photoURL ?? undefined}
            />
          </IconButton>
        )}

        {me === null && (
          <Button
            onClick={signIn}
            variant="contained"
            color="primary"
            children="Sign In"
          />
        )}
      </Toolbar>

      <UserMenu
        open={userMenuOpen}
        onClose={closeUserMenu}
        anchorEl={userIconRef.current}
      />
    </AppBar>
  );
}

export { AppToolbar };
