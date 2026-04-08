import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { AnimatePresence } from 'framer-motion'; // ANIMATION IMPORT

// Layout & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import NotesPage from './pages/NotesPage';
import AssignmentPage from './pages/AssignmentPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import CheckoutPage from './pages/CheckoutPage';
import TrackOrder from './pages/TrackOrder'; 

const ADMIN_EMAIL = 'syllabusspineadmins@gmail.com'; 

// --- 1. NEW COMPONENT: Handles the page exit/entry animations ---
const AnimatedRoutes = ({ session }) => {
  const location = useLocation(); // This safely tracks page changes

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/assignments" element={<AssignmentPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin-control"
          element={
            session?.user?.email === ADMIN_EMAIL
              ? <AdminDashboard />
              : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

// --- 2. YOUR MAIN APP COMPONENT ---
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
          {/* We swapped your <Routes> for our new Animated component here */}
          <AnimatedRoutes session={session} /> 
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;