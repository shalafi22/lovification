import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBCUOiRosuA1U1S8LNsRHG9v7WlqqX2fE0",
    authDomain: "lovification-2521b.firebaseapp.com",
    projectId: "lovification-2521b",
    storageBucket: "lovification-2521b.appspot.com",
    messagingSenderId: "206445086162",
    appId: "1:206445086162:web:fa6d0cfb21f994f039f40b",
    measurementId: "G-Q9SCTWVN1N"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }

  export { firebase }