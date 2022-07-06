import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import './App.css';
import Navbar from "./components/navbar/Navbar";
import AppRouter from './router/AppRouter';

function App() {
  return (
      <BrowserRouter>
          <Navbar/>
          <div className="App">
              <AppRouter/>
          </div>
      </BrowserRouter>
  );
}

export default App;
