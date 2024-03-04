import { useCurrentUser } from "@chainfuse/react";
import { Box, Container, Toolbar } from "@mui/material";
import * as React from "react";
import { Navigate, Outlet, useLocation, useMatch } from "react-router-dom";
import { AppToolbar } from "./AppToolbar.js";
import { useDrawer } from "./Drawer.js";
import { SecondaryToolbar } from "./SecondaryToolbar.js";

const MainDrawer = React.lazy(() => import("./Drawer.js").then(x => ({ default: x.MainDrawer }))); // prettier-ignore
const SiteDrawer = React.lazy(() => import("./Drawer.js").then(x => ({ default: x.SiteDrawer }))); // prettier-ignore

export function Layout(): JSX.Element {
  const drawer = useDrawer();
  const location = useLocation();
  const me = useCurrentUser();
  const sitesMatch = useMatch({ path: "sites", end: false });
  const templatesMatch = useMatch({ path: "templates", end: false });
  const siteMatch = useMatch({ path: "sites/:id", end: false });

  if (me === undefined) {
    return null as unknown as JSX.Element;
  }

  if (me === null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const useMainLayout = Boolean(sitesMatch || templatesMatch);

  return (
    <React.Fragment>
      <AppToolbar />
      <Toolbar />
      {useMainLayout ? (
        <React.Fragment>
          <Box
            sx={{
              pl: {
                xs:
                  drawer.open && drawer.variant === "persistent"
                    ? `${drawer.width}px`
                    : 0,
                xl: 0,
              },
              transition: (theme) =>
                drawer.open
                  ? `padding-left ${theme.transitions.duration.enteringScreen}ms ${theme.transitions.easing.easeOut}`
                  : `padding-left ${theme.transitions.duration.leavingScreen}ms ${theme.transitions.easing.easeIn}`,
            }}
          >
            {siteMatch && <SecondaryToolbar />}
            <Container sx={{ my: 4 }} maxWidth="md">
              <Outlet />
            </Container>
          </Box>

          <React.Suspense children={<MainDrawer open={!siteMatch} />} />
          <React.Suspense children={<SiteDrawer open={!!siteMatch} />} />
        </React.Fragment>
      ) : (
        <Outlet />
      )}
    </React.Fragment>
  );
}
