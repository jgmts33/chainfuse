import envars from "envars";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import repl from "node:repl";
import { $, chalk } from "zx";

// Load environment variables
envars.config();

// Initialize Firebase Admin SDK
const projectId = $.env.GOOGLE_CLOUD_PROJECT;
const credential = cert(JSON.parse($.env.GOOGLE_CLOUD_CREDENTIALS));
const app = initializeApp({ projectId, credential });
const db = getFirestore(app);

Object.defineProperty(global, "db", { value: db });
Object.defineProperty(global, "app", { value: app });
Object.defineProperty(global, "sites", { value: db.collection("sites") });

/**
 * Starts a REPL shell that can be used for interacting with Firestore
 * database from a terminal window.
 */
console.log(`Connected to ${chalk.greenBright(projectId)}. Usage example:`);
console.log(``);
console.log(`   snap = await db.collection("sites").get()`);
console.log(`   snap.docs.map(x => ({ id: x.id, ...x.data() }))`);
console.log(``);
console.log(`Type ${chalk.greenBright(".exit")} to exit the REPL shell`);
repl.start(chalk.blueBright(`#> `)).on("exit", () => db.terminate());
