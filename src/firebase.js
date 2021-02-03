
  import firebase from 'firebase';

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyC0jEnfR1YWbA1b-gDMqUDQoLDnnAe2nr4",
    authDomain: "instragram-clone-react1.firebaseapp.com",
    databaseURL: "https://instragram-clone-react1.firebaseio.com",
    projectId: "instragram-clone-react1",
    storageBucket: "instragram-clone-react1.appspot.com",
    messagingSenderId: "918301484915",
    appId: "1:918301484915:web:950073b1bfa847bd1d0706",
    measurementId: "G-T2CV7BLMBP"
  })

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
//   const auth = firebase.auth();


  export { db, auth , storage};