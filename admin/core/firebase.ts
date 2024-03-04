import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase app instance.
 */
export const app = initializeApp(
  location.hostname === "chainfuse.com" || location.hostname === "chainfuse.io"
    ? {
        projectId: "chainfuse",
        authDomain: "chainfuse.com",
        appId: "1:370459782396:web:b906c1397aa085ce62fb79",
        apiKey: "AIzaSyApwYy2O33hvwo2G3OSt1Vi0TTjvW45UVU",
      }
    : {
        projectId: "chainfuse-test",
        authDomain: "chainfuse.com",
        appId: "1:619597108308:web:a1095b71fef6de5874c9c1",
        apiKey: "AIzaSyCMW3112anSFQP_HNyZ5ttcmEoD4-iGjBU",
      }
);

/**
 * Firebase authentication instance.
 */
export const auth = getAuth(app);

/**
 * Firestore database instance.
 */
export const db = getFirestore(app);
