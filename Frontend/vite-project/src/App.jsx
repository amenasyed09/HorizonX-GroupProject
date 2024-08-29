import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './PAGES/Home';
import Login from './PAGES/Login';
import Signup from './PAGES/Signup';

function App() {
  return (
  <div>
    <Router>
      <Routes>
        <Route path = '/' element={<Home />}></Route>
        <Route path = '/login' element={<Login />}></Route>
        <Route path = '/signup' element={<Signup />}></Route>
      </Routes>
    </Router>
  </div>
  );
}

export default App;
