import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC4AqQhFknL1_FsrXec8REP1PFei2OToxM",
    authDomain: "mygpt-9c820.firebaseapp.com",
    projectId: "mygpt-9c820",
    storageBucket: "mygpt-9c820.appspot.com",
    messagingSenderId: "304980670815",
    appId: "1:304980670815:web:c7b8d0c6269f09fad8deea",
    measurementId: "G-SM3BW86XLZ"
};

const firebaseApp = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: "select_account"
})
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export { db, auth };