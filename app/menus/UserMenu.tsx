import { useSignOut } from "@chainfuse/react";
import { Menu, MenuItem, MenuProps } from "@mui/material";
import * as React from "react";
import { atom, useRecoilState, useSetRecoilState } from "recoil";

type UserMenuProps = Omit<MenuProps, "children" | "open" | "anchorEl">;

const userMenu = atom<{ open: boolean; anchorEl: Element | null }>({
  key: "UserMenu",
  default: { open: false, anchorEl: null },
});

export function UserMenu(props: UserMenuProps): JSX.Element {
  const [state, setState] = useRecoilState(userMenu);
  const signOut = useSignOut();

  const handleSignOut = React.useCallback(() => {
    handleClose();
    signOut();
  }, []);

  const handleClose = React.useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <Menu
      open={state.open}
      onClose={handleClose}
      anchorEl={state.anchorEl}
      {...props}
    >
      <MenuItem onClick={handleSignOut} children="Log Out" />
    </Menu>
  );
}

export function useUserMenu(anchorRef: React.RefObject<Element>) {
  const setState = useSetRecoilState(userMenu);
  return React.useMemo(
    () => ({
      open() {
        setState((prev) => ({ open: true, anchorEl: anchorRef.current }));
      },
      close() {
        setState((prev) => ({ open: false, anchorEl: null }));
      },
      toggle() {
        setState((prev) => ({ open: !prev.open, anchorEl: anchorRef.current }));
      },
    }),
    []
  );
}
