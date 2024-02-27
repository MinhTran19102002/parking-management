// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBXvv4XIjeDUL-RZkpkmnDir3ZYmZx8-aQ",
    authDomain: "vixmo-d9148.firebaseapp.com",
    databaseURL: "https://vixmo-d9148-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "vixmo-d9148",
    storageBucket: "vixmo-d9148.appspot.com",
    messagingSenderId: "259931165337",
    appId: "1:259931165337:web:b323266258ce8555d55e08",
    measurementId: "G-PQ7BGZ3DWS"
};

const _firebase = () => {

    let firebase = initializeApp(firebaseConfig)
    return firebase
}
export default _firebase()