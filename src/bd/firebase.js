import firebase from 'firebase/compat/app'; 
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBPdR3x9omSm2UIPIycgF4rwMrhFeYyGRs",
    authDomain: "login-657a6.firebaseapp.com",
    projectId: "login-657a6",
    storageBucket: "login-657a6.appspot.com",
    messagingSenderId: "1001443105598",
    appId: "1:1001443105598:web:b8a5506d66a0cc8906aa6f"
  };

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth(); 

export default firebaseConfig;