import React, { useEffect, useState, lazy, Suspense } from 'react';
import ScrollToTop from './components/ScrollToTop';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

// 1. Eagerly load the critical layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// 2. Lazy load all the heavy pages!
const Home = lazy(() => import('./pages/Home'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const AssignmentPage = lazy(() => import('./pages/AssignmentPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const UserDashboard = lazy(() => import('./pages/UserDashboard')); 
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const TrackOrder = lazy(() => import('./pages/TrackOrder')); 

const ADMIN_EMAIL = 'syllabusspineadmins@gmail.com'; 

// 3. Create a smooth fallback loader
const PageLoader = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
      Loading Spine...
    </p>
  </div>
);

const AnimatedRoutes = ({ session }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
        <Route path="/notes" element={<Suspense fallback={<PageLoader />}><NotesPage /></Suspense>} />
        <Route path="/checkout" element={<Suspense fallback={<PageLoader />}><CheckoutPage /></Suspense>} />
        <Route path="/track-order" element={<Suspense fallback={<PageLoader />}><TrackOrder /></Suspense>} />
        <Route path="/login" element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />

        {/* --- PROTECTED ROUTES --- */}
        <Route 
          path="/assignments" 
          element={
            session ? <Suspense fallback={<PageLoader />}><AssignmentPage /></Suspense> : <Navigate to="/login" />
          } 
        />
        <Route
          path="/dashboard"
          element={
            session ? <Suspense fallback={<PageLoader />}><UserDashboard /></Suspense> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin-control"
          element={
            session?.user?.email === ADMIN_EMAIL
              ? <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>
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
    if (!motion) return null;
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
    return <PageLoader />;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50 antialiased">
        <Navbar session={session} />
        
        <main className="flex-grow">
          <AnimatedRoutes session={session} /> 
        </main>
        
        <Footer />

        <Analytics />
        <SpeedInsights />
      </div>
    </Router>
  );
}

export default App;