import { Navigate, RouteProps, useLocation } from "react-router-dom";
import { useCurrentUser } from "../core/auth.js";

type AuthorizedProps = {
  to: RouteProps["element"];
};

export function Authorized(props: AuthorizedProps): JSX.Element {
  const location = useLocation();
  const me = useCurrentUser();

  if (me === undefined) {
    return null as unknown as JSX.Element;
  }

  if (me === null) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!me.email?.endsWith("@chainfuse.io")) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location, error: "Access denied." }}
        replace
      />
    );
  }

  return props.to as unknown as JSX.Element;
}
