// ✅ Firebase Configuration (Use compat version)
const firebaseConfig = {
    apiKey: "AIzaSyBUHD0MHUWJIlGjOSM-fM3_wHP9fURM-8o",
    authDomain: "habitlegacy-b3d84.firebaseapp.com",
    projectId: "habitlegacy-b3d84",
    storageBucket: "habitlegacy-b3d84.appspot.com",
    messagingSenderId: "936139528764",
    appId: "1:936139528764:web:95f5e7682ce2f64bf1c139",
    measurementId: "G-W9NLJ3J0W3"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

console.log("✅ Firebase Initialized Successfully!");
