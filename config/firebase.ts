import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

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

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
