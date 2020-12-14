import React from 'react';
import logo from './logo.svg';
import './App.css';
import Uploader from './components/Uploader';

function App() {
  return (
    <div className="App">
      <main className="App-conent">
          <img className="koho-logo" alt="KOHO logo" src="https://lever-client-logos.s3.amazonaws.com/cd28cdb4-b64a-4531-9755-2df6d7078e82-1577991460239.png" />
          <Uploader />
      </main>
    </div>
  );
}

export default App;
