import { type Site as SiteRecord } from "db";
import {
  collection,
  CollectionReference,
  doc,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import * as React from "react";
import {
  atomFamily,
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useRecoilValueLoadable,
} from "recoil";
import { db } from "./firebase.js";

const sites = collection(db, "sites") as SitesRef;

export const Site = atomFamily<
  DocumentSnapshot<SiteRecord>,
  string | undefined
>({
  key: "Site",
  dangerouslyAllowMutability: true,
  effects: [
    (ctx) => {
      if (ctx.trigger === "get") {
        const param = ctx.node.key.replace(/^\w+__/, "");

        if (!param) {
          ctx.setSelf(Promise.reject("Site ID cannot be empty."));
          return;
        }

        const siteId = JSON.parse(param);
        return onSnapshot(doc(sites, siteId), {
          next(value) {
            ctx.setSelf(value);
          },
          error(err) {
            ctx.setSelf(Promise.reject(err));
          },
        });
      }
    },
  ],
});

export const SiteList = atomFamily<QuerySnapshot<SiteRecord>, string | null>({
  key: "SiteList",
  dangerouslyAllowMutability: true,
  effects: [
    (ctx) => {
      if (ctx.trigger === "get") {
        const param = ctx.node.key.replace(/^\w+__/, "");
        const project = param ? JSON.parse(param) : false;

        return onSnapshot(query(sites, where("project", "==", project)), {
          next(value) {
            ctx.setSelf(value);
          },
          error(err) {
            ctx.setSelf(Promise.reject(err));
          },
        });
      }
    },
  ],
});

export function useSite(id: string | undefined) {
  return useRecoilValue(Site(id));
}

export function useSiteLoadable(id: string | undefined) {
  return useRecoilValueLoadable(Site(id));
}

export function useSiteRefresh(id: string | undefined) {
  return React.useCallback(() => getDoc(doc(sites, id)), [id]);
}

export function useSiteList(project: string | null) {
  return useRecoilValue(SiteList(project));
}

export function useSiteListLoadable(project: string | null) {
  return useRecoilValueLoadable(SiteList(project));
}

export function useSiteListRefresh(project: string | null) {
  return useRecoilRefresher_UNSTABLE(SiteList(project));
}

type SitesRef = CollectionReference<SiteRecord>;
