// Import the functions you need from the SDKs you need
//import { initializeApp } from 'firebase/app';
import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import { getAuth , Auth, initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//You can set up your own firebase config: https://firebase.google.com/
//This config below will be disabled to prevent users using it.
const firebaseConfig = {
  //ADD your own config here from FIREBASE
};

// Initialize Firebase
//This setup is to use the AsyncStorage from @react-native-async-storage/async-storage
//otherwise there is a warning that AsyncStorage will be removed from 'react-native' in a later release.
//https://github.com/firebase/firebase-js-sdk/issues/1847

let app;
let auth;
if (getApps().length < 1) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

module.exports = { auth };