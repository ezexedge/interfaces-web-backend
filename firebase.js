const firebase = require('firebase/app')
require('firebase/auth')
require('@firebase/messaging')
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADKlc79QGIxkMgDPUheddtl6PSaz7KOCU",
  authDomain: "interfaces-fb2a7.firebaseapp.com",
  projectId: "interfaces-fb2a7",
  storageBucket: "interfaces-fb2a7.appspot.com",
  messagingSenderId: "24393464786",
  appId: "1:24393464786:web:bb1809e57804545c27260b"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  module.exports = firebase