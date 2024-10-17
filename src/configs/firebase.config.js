/* eslint-disable linebreak-style */
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEjSOzCp2u8hYE7XNMXeAgAjzIj4Fludw",
  authDomain: "printable-c2fe6.firebaseapp.com",
  projectId: "printable-c2fe6",
  storageBucket: "printable-c2fe6.appspot.com",
  messagingSenderId: "154826014826",
  appId: "1:154826014826:web:0035466d2d830ca2f10a13",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
//

const provider = new GoogleAuthProvider();

export { auth, firestore, storage, provider };
