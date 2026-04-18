import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { AnimatePresence } from 'framer-motion';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

// Layout & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import NotesPage from './pages/NotesPage';
import AssignmentPage from './pages/AssignmentPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard'; 
import LoginPage from './pages/LoginPage';
import CheckoutPage from './pages/CheckoutPage';
import TrackOrder from './pages/TrackOrder'; 

const ADMIN_EMAIL = 'syllabusspineadmins@gmail.com'; 

const AnimatedRoutes = ({ session }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/login" element={<LoginPage />} />

        {/* --- PROTECTED ROUTES --- */}
        
        {/* 1. ORDER ASSIGNMENTS (Requires Login) */}
        <Route 
          path="/assignments" 
          element={
            session ? <AssignmentPage /> : <Navigate to="/login" />
          } 
        />

        {/* 2. THE STUDENT DASHBOARD (Normal User) */}
        <Route
          path="/dashboard"
          element={
            session ? <UserDashboard /> : <Navigate to="/login" />
          }
        />

        {/* 3. THE ADMIN CONTROL (Restricted) */}
        <Route
          path="/admin-control"
          element={
            session?.user?.email === ADMIN_EMAIL
              ? <AdminDashboard />
              : <Navigate to="/dashboard" />
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [session, setSession] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 antialiased">
        <Navbar session={session} />
        
        <main className="flex-grow">
          <AnimatedRoutes session={session} /> 
        </main>
        
        <Footer />

        {/* VERCEL TRACKING COMPONENTS */}
        <Analytics />
        <SpeedInsights />
      </div>
    </Router>
  );
}

export default App;