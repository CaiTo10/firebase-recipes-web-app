import firebase from "./FirebaseConfig";
// create firebase auth()
const auth = firebase.auth()
// create register user handler function
const registerUser = (email,password)=>{
    return auth.createUserWithEmailAndPassword(email,password)
}
// create register user handler function
const loginUser = (email,password)=>{
    return auth.signInWithEmailAndPassword(email,password)
}
// create logout user handler function
const logoutUser =()=>{
    return auth.signOut()
}

// create reset password fo user handler function
const sendPasswordResetEmail=(email)=>{
    return auth.sendPasswordResetEmail(email)
}

// create login with google for user handler function
const loginWithGoogle=()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    return auth.signInWithPopup(provider)
}
// create subscribe user auth status handler function
const subscribeToAuthChanges = (handleAuthChange)=>{
    return auth.onAuthStateChanged((user)=>{
        handleAuthChange(user)
    })
}

const FirebaseAuthService ={
    registerUser,
    loginUser,
    logoutUser,
    sendPasswordResetEmail,
    loginWithGoogle,
    subscribeToAuthChanges
}

export default FirebaseAuthService;