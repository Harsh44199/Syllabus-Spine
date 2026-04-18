import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react'; 

const Navbar = ({ session }) => {
  // State to control the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!motion) return null; // Linter fix

  // Helper function to close menu when a link is clicked
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* LOGO SECTION (Always visible) */}
            <Link to="/" onClick={closeMenu}>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 group z-50 relative"
              >
                <motion.div 
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-md shadow-blue-200 shrink-0"
                >
                  S
                </motion.div>
                {/* On extreme small screens (<360px), we can hide the text to save space, but visible on standard mobile (xs) */}
                <span className="font-black text-xl tracking-tight text-slate-900 hidden xs:block sm:block">
                  Syllabus Spine
                </span>
              </motion.div>
            </Link>

            {/* DESKTOP NAVIGATION (Hidden on mobile: hidden md:flex) */}
            <div className="hidden md:flex items-center gap-8">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link to="/notes" className="font-bold text-slate-500 hover:text-blue-600 transition-colors">Library</Link>
              </motion.div>
              
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link to="/assignments" className="font-bold text-slate-500 hover:text-blue-600 transition-colors">Order</Link>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link to="/track-order" className="font-bold text-slate-500 hover:text-blue-600 transition-colors">Track</Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="ml-2">
                {session ? (
                  <Link to="/admin-control" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-blue-600 transition-colors shadow-lg">
                    DASHBOARD
                  </Link>
                ) : (
                  <Link to="/login" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-slate-900 transition-colors shadow-lg shadow-blue-200">
                    SIGN IN
                  </Link>
                )}
              </motion.div>
            </div>

            {/* MOBILE MENU TOGGLE BUTTON (Visible only on mobile: flex md:hidden) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors relative z-50"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>

          </div>
        </div>
      </motion.nav>

      {/* MOBILE FULL-SCREEN MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl md:hidden pt-24 px-6 pb-6 flex flex-col"
          >
            <div className="flex flex-col gap-6 text-center text-2xl font-black mt-10">
              {/* NEW HOME BUTTON HERE */}
              <Link to="/" onClick={closeMenu} className="text-slate-700 hover:text-blue-600 py-2 border-b border-slate-100">Home</Link>
              <Link to="/notes" onClick={closeMenu} className="text-slate-700 hover:text-blue-600 py-2 border-b border-slate-100">Library</Link>
              <Link to="/assignments" onClick={closeMenu} className="text-slate-700 hover:text-blue-600 py-2 border-b border-slate-100">Order Assignments</Link>
              <Link to="/track-order" onClick={closeMenu} className="text-slate-700 hover:text-blue-600 py-2 border-b border-slate-100">Track Order</Link>
            </div>

            <div className="mt-auto mb-10 w-full">
              {session ? (
                <Link to="/admin-control" onClick={closeMenu}>
                  <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl">
                    GO TO DASHBOARD
                  </button>
                </Link>
              ) : (
                <Link to="/login" onClick={closeMenu}>
                  <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200">
                    SIGN IN
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;