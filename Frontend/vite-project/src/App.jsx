import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./PAGES/Components/Navbar/Navbar.jsx";
import Home from "./PAGES/Home";
import Login from "./PAGES/Login";
import Signup from "./PAGES/Signup";

import PropertyDisplay from "./PAGES/Property/Filter&Search/PropertyDisplay.jsx";
import UserProperties from "./PAGES/Property/Update&Delete/UserProperties";
import PropertyUpdateForm from "./PAGES/Property/Update&Delete/PropertyUpdateForm";
import PropertyForm1 from "./PAGES/Property/PropertyForm1";
import PriceHelp from "./PAGES/Property/PriceHelp.jsx";
import PropertyDetailPage from "./PAGES/Property/Property_detail/PropertyDetailPage.jsx";
import ImageUpdateForm from "./PAGES/Property/Update&Delete/ImageUpdateForm.jsx";


function App() {
  return (
    <div>
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>

<Route path="/getAllProperties/:saleType" element={<PropertyDisplay />} />



          <Route path="/allProperties" element={<PropertyDisplay />}></Route>
      
          <Route path="/userProperties" element={<UserProperties />}></Route>
          <Route path="/update/:propertyId"element={<PropertyUpdateForm />}></Route>
          <Route path="/newProperty" element={<PropertyForm1/>}></Route>
          <Route path="/pricehelp" element={<PriceHelp />}></Route>
          <Route path='/property/:propertyId' element={<PropertyDetailPage/>}></Route>
          <Route path="/updateImages/:propertyId" element={<ImageUpdateForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
