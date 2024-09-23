import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_API_KEY,
  authDomain: process.env.NEXT_AUTH_DOMAIN,
  projectId: process.env.NEXT_PROJECT_ID,
  storageBucket:  process.env.NEXT_STORAGE_BUCKET,
  messagingSenderId:  process.env.NEXT_MESSAGING_SENDER_ID,
  appId:  process.env.NEXT_APP_ID,
  measurementId:  process.env.NEXT_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const db = getFirestore(app)
export const auth = getAuth(app)