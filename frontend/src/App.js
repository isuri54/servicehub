import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Provider from './components/Provider';
import ProviderDashboard from './components/ProviderDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home/>}/>
        <Route path="/provider" element={<Provider/>}/>
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;