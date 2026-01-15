import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, initializeAuth } from "firebase/auth";
//@ts-ignore
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyCFkBHOsmSkFAnMV91e0wgDQkqP_nlsLaw",
  authDomain: "zeel1-a0b24.firebaseapp.com",
  databaseURL:
    "https://zeel1-a0b24-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zeel1-a0b24",
  storageBucket: "zeel1-a0b24.appspot.com",
  messagingSenderId: "739459855039",
  appId: "1:739459855039:web:25ee801738fd70a12a8c0a",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch {
    auth = getAuth(app);
  }
}

export { auth };
