import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyAUARpOmDLeYYoakarBnoKjCPKgrwixPJc",
    authDomain: "estudos-f924c.firebaseapp.com",
    projectId: "estudos-f924c",
    storageBucket: "estudos-f924c.appspot.com",
    messagingSenderId: "213614391754",
    appId: "1:213614391754:web:27c3b9db7a0128f6079f33",
    measurementId: "G-16C911D1SS"
  };


  const firebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  export { auth, db, storage };
