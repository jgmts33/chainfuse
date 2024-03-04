export * from "./schemas/Project";
import * as site from "./schemas/Site";

import { DocumentData } from "firebase/firestore";

export interface Workspace extends DocumentData {
  /**
   * The author's user ID.
   */
  uid: string;
  /**
   * The name of the workspace.
   */
  name: string;
}

export interface Project extends DocumentData {
  userId: string;
  name: string;
}

export type Site = Omit<site.Site, "id">;
