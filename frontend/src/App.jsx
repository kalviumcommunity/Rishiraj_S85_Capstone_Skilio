import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from 'react-hot-toast';
import AuthProvider from "./context/AuthContext";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import PostSkill from './pages/PostSkill';
import SkillDetail from './pages/SkillDetail';
import Premium from './pages/Premium';
import NotFound from './pages/NotFound';
import AuthCallback from './pages/AuthCallback';
import Categories from './pages/Categories';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
              <Route path="/chat" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/post-skill" element={<PostSkill />} />
              <Route path="/skill/:id" element={<SkillDetail />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/categories/:categoryName" element={<Categories />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

