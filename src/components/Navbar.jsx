import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BookOpen, PenTool, Search, LayoutDashboard, Home } from 'lucide-react'; 

const Navbar = ({ session }) => {
  // ==========================================
  // 1. ALL HOOKS MUST GO FIRST
  // ==========================================
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  // ==========================================
  // 2. HELPER FUNCTIONS
  // ==========================================
  const closeMenu = () => setIsMobileMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  // ==========================================
  // 3. EARLY RETURNS (Must be AFTER Hooks)
  // ==========================================
  if (!motion) return null; // Linter safe-guard

  // ==========================================
  // 4. MAIN UI RENDER
  // ==========================================
  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            
            {/* LOGO SECTION */}
            <Link to="/" onClick={closeMenu} className="relative z-50">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 sm:gap-3 group"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 text-white rounded-lg md:rounded-xl flex items-center justify-center font-black text-lg md:text-xl shadow-md shadow-blue-200 shrink-0 transition-transform group-hover:rotate-12">
                  S
                </div>
                <span className="font-black text-lg md:text-xl tracking-tight text-slate-900 hidden xs:block sm:block">
                  Syllabus <span className="text-blue-600">Spine</span>
                </span>
              </motion.div>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/notes" className={`font-bold transition-colors ${isActive('/notes') ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>
                Library
              </Link>
              
              <Link to="/assignments" className={`font-bold transition-colors ${isActive('/assignments') ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>
                Order
              </Link>

              <Link to="/track-order" className={`font-bold transition-colors ${isActive('/track-order') ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>
                Track
              </Link>

              <div className="ml-2 pl-6 border-l border-slate-200">
                {session ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/dashboard" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200">
                      DASHBOARD
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/login" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-slate-900 transition-colors shadow-lg shadow-blue-200">
                      SIGN IN
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>

            {/* MOBILE MENU TOGGLE BUTTON */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors relative z-50 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl md:hidden pt-20 px-6 pb-6 flex flex-col h-[100dvh]"
          >
            <div className="flex flex-col gap-2 mt-8">
              
              <MobileNavLink to="/" onClick={closeMenu} icon={<Home size={20} />} text="Home" index={1} isActive={isActive('/')} />
              <MobileNavLink to="/notes" onClick={closeMenu} icon={<BookOpen size={20} />} text="Study Library" index={2} isActive={isActive('/notes')} />
              <MobileNavLink to="/assignments" onClick={closeMenu} icon={<PenTool size={20} />} text="Order Assignment" index={3} isActive={isActive('/assignments')} />
              <MobileNavLink to="/track-order" onClick={closeMenu} icon={<Search size={20} />} text="Track Order" index={4} isActive={isActive('/track-order')} />
              
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-auto mb-6 w-full pt-6 border-t border-slate-100"
            >
              {session ? (
                <Link to="/dashboard" onClick={closeMenu}>
                  <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-slate-200 active:scale-95 transition-transform">
                    <LayoutDashboard size={18} /> GO TO DASHBOARD
                  </button>
                </Link>
              ) : (
                <Link to="/login" onClick={closeMenu}>
                  <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 active:scale-95 transition-transform">
                    SIGN IN / REGISTER
                  </button>
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Sub-component for Mobile Links to keep the code clean
const MobileNavLink = ({ to, onClick, icon, text, index, isActive }) => (
  <motion.div
    custom={index}
    variants={{
      hidden: { opacity: 0, x: -20 },
      visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.1 } })
    }}
    initial="hidden"
    animate="visible"
  >
    <Link 
      to={to} 
      onClick={onClick} 
      className={`flex items-center gap-4 py-4 px-4 rounded-2xl font-black text-lg transition-all ${
        isActive 
        ? 'bg-blue-50 text-blue-600' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <div className={`${isActive ? 'text-blue-500' : 'text-slate-400'}`}>
        {icon}
      </div>
      {text}
    </Link>
  </motion.div>
);

export default Navbar;