import { CurrentUser } from "@chainfuse/react";
import { type Workspace } from "db";
import {
  collection,
  CollectionReference,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  selector,
  useRecoilRefresher_UNSTABLE,
  useRecoilValueLoadable,
} from "recoil";
import { db } from "./firebase.js";

export const WorkspaceList = selector({
  key: "WorkspaceList",
  dangerouslyAllowMutability: true,
  async get({ get }) {
    const me = get(CurrentUser);
    const queryRef = query(
      collection(db, "workspaces") as CollectionReference<Workspace>,
      where("uid", "==", me?.uid ?? "none")
    );
    return await getDocs(queryRef);
  },
});

export function useWorkspaceListLoadable() {
  return useRecoilValueLoadable(WorkspaceList);
}

export function useWorkspaceListRefresh() {
  return useRecoilRefresher_UNSTABLE(WorkspaceList);
}
