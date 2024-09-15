<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./PAGES/Components/Navbar/Navbar.jsx";
import Home from "./PAGES/Home";
import Login from "./PAGES/Login";
import Signup from "./PAGES/Signup";
import PropertyForm from "./PAGES/Property/PropertyForm";
import PropertyDisplay from "./PAGES/Property/Filter&Search/PropertiesDisplay";
import UserProperties from "./PAGES/Property/Update&Delete/UserProperties";
import PropertyUpdateForm from "./PAGES/Property/Update&Delete/PropertyUpdateForm";
import PropertyForm1 from "./PAGES/Property/PropertyForm1";
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './PAGES/Home';
import Login from './PAGES/Login';
import Signup from './PAGES/Signup';
import PropertyForm from './Property/PropertyForm';
import PropertyDisplay from './Property/Filter&Search/PropertiesDisplay';

import CoordinatesMap from './Property/CoordinatesMap';
>>>>>>> b17b46daca501be0bf13e19c25929f6fa416279a

import UserProperties from './Property/Update&Delete/UserProperties';
import PropertyUpdateForm from './Property/Update&Delete/PropertyUpdateForm';
import PropertyForm1 from './Property/PropertyForm1';
function App() {
  return (
<<<<<<< HEAD
    <div>
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/newProperty" element={<PropertyForm />}></Route>
          <Route path="/allProperties" element={<PropertyDisplay />}></Route>
          <Route path="/update" element={<PropertyUpdateForm />}></Route>
          <Route path="/userProperties" element={<UserProperties />}></Route>
          <Route
            path="/update/:propertyId"
            element={<PropertyUpdateForm />}
          ></Route>
          <Route path="/newProperty/" element={<PropertyForm1 />}></Route>
        </Routes>
      </Router>
    </div>
=======
  <div>
    <Router>
      <Routes>
        <Route path = '/' element={<Home />}></Route>
        <Route path = '/login' element={<Login />}></Route>
        <Route path = '/signup' element={<Signup />}></Route>
        <Route path='/newProperty' element={<PropertyForm/>}></Route>
        <Route path='/allProperties' element={<PropertyDisplay/>}></Route>
      <Route path='/update' element={<PropertyUpdateForm/>}></Route>
        <Route path='/getCoordinates' element={<CoordinatesMap/>}></Route>
        <Route path='/userProperties' element={<UserProperties/>}></Route>
     <Route path='/update/:propertyId' element={<PropertyUpdateForm/>}></Route>
     <Route path='/newProperty/' element={<PropertyForm1/>}></Route>
      </Routes>
    </Router>
  </div>
>>>>>>> b17b46daca501be0bf13e19c25929f6fa416279a
  );
}

export default App;
