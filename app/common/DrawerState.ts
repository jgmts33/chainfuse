import { useMediaQuery, useTheme } from "@mui/material";
import * as React from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

const drawerKey = "drawer";

export const Drawer = atom({
  key: "Drawer",
  dangerouslyAllowMutability: true,
  default: {
    open:
      localStorage?.getItem(drawerKey) === "open"
        ? true
        : localStorage?.getItem(drawerKey) === "closed"
        ? false
        : undefined,
    width: 280,
  },
});

export function useDrawer() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const value = useRecoilValue(Drawer);
  return React.useMemo(
    () => ({
      ...value,
      variant: (mdUp ? "persistent" : "temporary") as
        | "persistent"
        | "temporary",
    }),
    [value, mdUp]
  );
}

export function useToggleDrawer() {
  const setState = useSetRecoilState(Drawer);
  return React.useCallback(() => {
    setState((prev) => {
      localStorage?.setItem(drawerKey, prev.open ? "closed" : "open");
      return { ...prev, open: !prev.open };
    });
  }, []);
}
