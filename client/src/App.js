import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import React, { useState } from "react";

import NotesList from "./NotesList";
import AuthButtons from './AuthButtons';

const apiCall = () => {
  axios.get('http://localhost:8080').then((data) => {
    //this console.log will be in our frontend console
    console.log(data)
  })
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className = "App">
      <header className ="App-header">
        {!user ? (
          <AuthButtons
          apiBase = "http://localhost:8080"
          onAuth={(u) => setUser(u)}
          />
        ) : (
          <>
          <h2> Welcome, {user.username}</h2>
          <NotesList apiBase="http://localhost:8080" userId = {user.id} />
          </>
        ) }
      </header>
    </div>
  );
}

export default App;