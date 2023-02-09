// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAovDfVg85quDUnbkSSGKdr5W-AnXfXBHo",
  authDomain: "zerohungerapp-dev.firebaseapp.com",
  projectId: "zerohungerapp-dev",
  storageBucket: "zerohungerapp-dev.appspot.com",
  messagingSenderId: "82989997051",
  appId: "1:82989997051:web:20b770b5a0ea11c7c1495e"
};

const app = firebase.initializeApp(firebaseConfig)
const auth = getAuth(app);
export {app, auth}