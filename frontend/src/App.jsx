import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from "./context/AuthContext"; // Changed from { AuthProvider } to AuthProvider
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

//test