/**
 * Firebase Web SDK initialisation (Google Sign-In only).
 */
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { webConfig } from "./firebaseWebConfig";

const app = initializeApp(webConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Always show the account chooser so shared computers can switch accounts.
googleProvider.setCustomParameters({ prompt: "select_account" });