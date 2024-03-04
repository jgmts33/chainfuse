import { GoogleAuthProvider, signInWithPopup, type User } from "firebase/auth";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { auth } from "./firebase.js";
import { currentUser } from "./state.js";

export function useCurrentUser(): User | null | undefined {
  return useRecoilValue(currentUser);
}

export function useGoogleSignIn(): () => Promise<User> {
  return React.useCallback(() => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then((res) => {
        // const credential = GoogleAuthProvider.credentialFromResult(res);
        // const token = credential?.accessToken;
        return res.user;
      })
      .catch((err) => {
        // const credential = GoogleAuthProvider.credentialFromError(err);
        throw err;
      });
  }, []);
}

export function useSignOut(): () => Promise<void> {
  return React.useCallback(() => auth.signOut(), []);
}

/**
 * Redirects the user to the previous page upon signing in.
 */
export function useSignInRedirect(): void {
  const me = useRecoilValue(currentUser);
  const location = useLocation();
  const navigate = useNavigate();

  const lastSignInRef = React.useRef(me?.metadata.lastSignInTime);
  const locationRef = React.useRef(location);

  React.useEffect(() => {
    locationRef.current = location;
  }, [location]);

  React.useEffect(() => {
    if (me && me.metadata.lastSignInTime !== lastSignInRef.current) {
      const state = locationRef.current.state as { from: Location } | undefined;
      if (state?.from) navigate(state.from, { replace: true });
    }
  }, [me?.metadata.lastSignInTime]);
}
