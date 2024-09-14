import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './PAGES/Home';
import Login from './PAGES/Login';
import Signup from './PAGES/Signup';
import PropertyForm from './Property/PropertyForm';
import PropertyDisplay from './Property/PropertiesDisplay';

import CoordinatesMap from './Property/CoordinatesMap';

function App() {
  return (
  <div>
    <Router>
      <Routes>
        <Route path = '/' element={<Home />}></Route>
        <Route path = '/login' element={<Login />}></Route>
        <Route path = '/signup' element={<Signup />}></Route>
        <Route path='/newProperty' element={<PropertyForm/>}></Route>
        <Route path='/allProperties' element={<PropertyDisplay/>}></Route>
      
        <Route path='/getCoordinates' element={<CoordinatesMap/>}></Route>
      </Routes>
    </Router>
  </div>
  );
}

export default App;
