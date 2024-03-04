import {
  ArrowBack,
  DomainAdd,
  Menu,
  ViewModule,
  Web,
} from "@mui/icons-material";
import {
  Card,
  Drawer,
  DrawerProps,
  IconButton,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  MenuList,
  Toolbar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import * as React from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useDrawer, useToggleDrawer } from "./DrawerState.js";
import { SecondaryToolbar } from "./SecondaryToolbar.js";

export function MainDrawer(props: { open: boolean }): JSX.Element {
  const drawer = useDrawer();
  const search = useSearch();

  return (
    <BaseDrawer open={drawer.open && props.open}>
      {/* <MenuItem
        sx={{ mt: 4 }}
        path={`/sites`}
        search={search}
        label="Sites"
        icon={<Web />}
      /> */}
      {/* WORKSPACE */}
      <MenuItem
        path={`/templates`}
        sx={{ mt: 2 }}
        search={search}
        label="Templates"
        icon={<ViewModule />}
      />
    </BaseDrawer>
  );
}

export function SiteDrawer(props: { open: boolean }): JSX.Element {
  const drawer = useDrawer();
  const search = useSearch();
  const params = useParams();

  return (
    <BaseDrawer open={drawer.open && props.open}>
      <SecondaryToolbar>
        <MenuItem
          path={`/sites`}
          search={search}
          label="All my sites"
          icon={<ArrowBack />}
        />
      </SecondaryToolbar>

      <MenuItem
        path={`/sites/${params.id}`}
        search={search}
        label="Website settings"
        icon={<Web />}
      />
      <MenuItem
        path={`/sites/${params.id}/domain`}
        search={search}
        label="Add Custom domain"
        icon={<DomainAdd />}
      />
    </BaseDrawer>
  );
}

const BaseDrawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  function BaseDrawer(props, ref): JSX.Element {
    const { PaperProps, children, ...other } = props;
    const toggleDrawer = useToggleDrawer();
    const drawer = useDrawer();
    const theme = useTheme();

    return (
      <Drawer
        open={drawer.open ?? (drawer.variant === "temporary" ? false : true)}
        PaperProps={{
          ...PaperProps,
          sx: {
            zIndex: theme.zIndex.appBar - 10,
            width: drawer.width,
            borderRightStyle:
              drawer.variant === "persistent" ? "none" : undefined,
            ...PaperProps?.sx,
          },
        }}
        onClose={toggleDrawer}
        variant={drawer.variant}
        {...other}
        ref={ref}
      >
        <Card elevation={drawer.variant === "temporary" ? 10 : 0}>
          <Toolbar>
            <IconButton onClick={toggleDrawer}>
              <Menu />
            </IconButton>
          </Toolbar>
        </Card>
        <MenuList sx={{ color: "text.secondary", pt: 0 }} children={children} />
      </Drawer>
    );
  }
);

export function MenuItem(props: MenuItemProps): JSX.Element {
  const { sx, path, search, label, icon } = props;
  const drawer = useDrawer();
  const toggleDrawer = useToggleDrawer();

  const handleClick = React.useCallback(() => {
    if (drawer.variant === "temporary") toggleDrawer();
  }, [drawer.variant, toggleDrawer]);

  return (
    <ListItemButton
      sx={{
        ...sx,
        ...(drawer.variant === "persistent" && {
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
        }),
      }}
      component={Link}
      to={`${path}${search}`}
      onClick={handleClick}
      selected={location.pathname === path}
    >
      <ListItemIcon sx={{ minWidth: 40, color: "inherit" }} children={icon} />
      <ListItemText primary={label} />
    </ListItemButton>
  );
}

/**
 * Resolves to either `?project=<id>` or an empty string
 */
function useSearch() {
  const [searchParams] = useSearchParams();
  return React.useMemo(() => {
    const project = searchParams.get("project");
    return project
      ? "?" + new URLSearchParams([["project", project]]).toString()
      : "";
  }, [searchParams]);
}

type MenuItemProps = {
  sx?: ListItemButtonProps["sx"];
  path: string;
  search: string;
  label: string;
  icon: React.ReactNode;
};

export { useDrawer, useToggleDrawer };
