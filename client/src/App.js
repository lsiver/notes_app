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

  function logout() {
    setUser(null);
  }

  return (
    <div className = "App">
      <header className ="App-header">
        {!user && <>
        <h1>
          Notes
        </h1>
        <p>
          A CRUD App Using:
        </p>
        <ul>
          <li>
            Express
          </li>
          <li>
            Node
          </li>
          <li>
            React
          </li>
          <li>
            PostgreSQL
          </li>
        </ul>
        </>}
        
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
        <br></br>
      
      {user &&
      <button onClick={logout} className="logoutBtn">
        Logout
      </button>
      }

      </header>
    </div>
  );
}

export default App;