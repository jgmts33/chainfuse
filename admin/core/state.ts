import { type CustomHostname } from "cloudflare-client";
import { type User } from "firebase/auth";
import { atom, selector } from "recoil";
import { HttpError } from "./errors.js";

export const currentUser = atom<User | null | undefined>({
  key: "CurrentUserAdmin",
  default: undefined,
  dangerouslyAllowMutability: true,
});

export const userList = selector<User[]>({
  key: "UserList",
  async get({ get }) {
    const me = get(currentUser);
    if (me) {
      const idToken = await me.getIdToken();
      const res = await fetch("/api/users", {
        headers: { [`Authorization`]: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.users;
      } else {
        const err = await res.json().catch(() => Promise.resolve());
        throw new HttpError(err?.message ?? res.statusText, res.status);
      }
    } else {
      return [];
    }
  },
});

export const hostnameList = selector<CustomHostname[]>({
  key: "HostnameList",
  dangerouslyAllowMutability: true,
  async get({ get }) {
    const me = get(currentUser);
    if (me) {
      const idToken = await me.getIdToken();
      const res = await fetch("/api/hostnames", {
        headers: { [`Authorization`]: `Bearer ${idToken}` },
      });
      if (res.ok) {
        return await res.json();
      } else {
        const err = await res.json().catch(() => Promise.resolve());
        throw new HttpError(err?.message ?? res.statusText, res.status);
      }
    } else {
      return [];
    }
  },
});
