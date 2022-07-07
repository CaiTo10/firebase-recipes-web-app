import './App.css';
// // eslint-disable-next-line no-unused-vars 
// import firebase from './FirebaseConfig';
import {useState} from 'react';
import FirebaseAuthService from './FirebaseAuthService'

import LoginForm from './components/LoginForm';

function App() {
  const [user,setUser]= useState(null)
  // monitoring the user auth status
  FirebaseAuthService.subscribeToAuthChanges(setUser)

  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title">Firebase Recipe</h1>
        <LoginForm existingUser={user}/>
      </div>
    </div>
  );
} 

export default App;
