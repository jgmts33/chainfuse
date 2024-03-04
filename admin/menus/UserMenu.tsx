import { Menu, MenuItem, MenuProps } from "@mui/material";
import * as React from "react";
import { useSignOut } from "../core/auth.js";

type UserMenuProps = Omit<MenuProps, "children">;

export function UserMenu(props: UserMenuProps): JSX.Element {
  const signOut = useSignOut();

  const handleSignOut = React.useCallback(
    (event: React.MouseEvent) => {
      props.onClose?.(event, "backdropClick");
      signOut();
    },
    [signOut]
  );

  return (
    <Menu {...props}>
      <MenuItem onClick={handleSignOut} children="Log Out" />
    </Menu>
  );
}
