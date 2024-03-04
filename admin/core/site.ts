import { collection, DocumentSnapshot, getDocs } from "firebase/firestore";
import {
  atom,
  selector,
  useRecoilCallback,
  useRecoilValueLoadable,
} from "recoil";
import { db } from "./firebase.js";
import { currentUser } from "./state.js";

type Site = {
  id: DocumentSnapshot["id"];
  metadata: DocumentSnapshot["metadata"];
  template: string;
  version: string;
  hostname?: string;
  env: Record<string, unknown>;
};

export const siteList = atom<Site[]>({
  key: "SiteList",
  default: selector<Site[]>({
    key: "SiteList/docs",
    async get(ctx) {
      const me = ctx.get(currentUser);
      if (me) {
        const snap = await getDocs(collection(db, "sites"));
        return snap.docs.map(
          (doc) =>
            ({
              id: doc.id,
              metadata: doc.metadata,
              ...doc.data(),
            } as Site)
        );
      } else {
        return [];
      }
    },
  }),
});

export function useSiteListLoadable() {
  return useRecoilValueLoadable(siteList);
}

export function useUpdateSiteList() {
  return useRecoilCallback(
    (ctx) => async () => {
      const snap = await getDocs(collection(db, "sites"));
      const sites = snap.docs.map(
        (doc) =>
          ({
            id: doc.id,
            metadata: doc.metadata,
            ...doc.data(),
          } as Site)
      );
      ctx.set(siteList, sites);
    },
    []
  );
}
