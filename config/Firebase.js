import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyAZH_TZb3lSLLcjV3iCFwpcyQ45mfrA3kA',
  authDomain: 'mobile-sensors.firebaseapp.com',
  databaseURL: 'https://mobile-sensors.firebaseio.com',
  projectId: 'mobile-sensors',
  storageBucket: 'mobile-sensors.appspot.com',
  messagingSenderId: '1068751649165',
};

firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;
export const storageRef = firebase.storage().ref();
