import { loggedInState } from "@chainfuse/react";
import { ConnectWallet } from "@chainfuse/ui";
import * as React from "react";
import { useRecoilState } from "recoil";

const MainDrawer = React.lazy(() => import("./Drawer.js").then(x => ({ default: x.MainDrawer }))); // prettier-ignore
const SiteDrawer = React.lazy(() => import("./Drawer.js").then(x => ({ default: x.SiteDrawer }))); // prettier-ignore

interface GateProps {
  children: React.ReactNode;
  skipWalletGate?: boolean;
}

export function Gate(props: GateProps): JSX.Element {
  const [isActive] = useRecoilState(loggedInState);

  if (isActive) {
    return <>{props.children}</>;
  } else {
    return (
      <React.Fragment>
        <ConnectWallet />
      </React.Fragment>
    );
  }
}
