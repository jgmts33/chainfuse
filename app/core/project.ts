import { CurrentUser } from "@chainfuse/react";
import { type Project } from "db";
import {
  collection,
  CollectionReference,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import * as React from "react";
import { useLocation } from "react-router-dom";
import {
  selector,
  useRecoilRefresher_UNSTABLE,
  useRecoilValueLoadable,
} from "recoil";
import { db } from "./firebase.js";

/**
 * Extract the current project ID from the URL path such as
 * `https://chainfuse.com/sites?project=roblox`.
 */
export function useCurrentProjectId(): string | null {
  const location = useLocation();
  return React.useMemo(() => {
    return (
      localStorage.getItem("project") ||
      new URLSearchParams(location.search).get("project")
    );
  }, [location.search]);
}

export const ProjectList = selector({
  key: "ProjectList",
  dangerouslyAllowMutability: true,
  async get({ get }) {
    const me = get(CurrentUser);
    const queryRef = query(
      collection(db, "projects") as CollectionReference<Project>,
      where("userId", "==", me?.uid ?? "none")
    );
    return await getDocs(queryRef);
  },
});

export function useProjectListLoadable() {
  return useRecoilValueLoadable(ProjectList);
}

export function useProjectListRefresh() {
  return useRecoilRefresher_UNSTABLE(ProjectList);
}
