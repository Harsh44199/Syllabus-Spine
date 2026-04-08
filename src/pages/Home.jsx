import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Edit3, Clock, ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const Home = () => {
  if (!motion) return null;
  // A simple staggered animation for the feature cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-20">
        
        {/* HERO SECTION */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-8"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Premium Study Materials for Classes 9-12 & Beyond
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-tight"
          >
            Master Your Syllabus. <br/>
            <span className="text-blue-600">Save Your Time.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-10"
          >
            Get instant access to top-tier notes, or hire us to complete your complex assignments so you can focus on what actually matters.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/notes">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
              >
                BROWSE LIBRARY <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link to="/assignments">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-black hover:bg-slate-50 flex items-center justify-center"
              >
                ORDER ASSIGNMENT
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* FEATURES GRID */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show" // This triggers the animation when the user scrolls down to it
          viewport={{ once: true }} // Only animates once
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen size={28} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Verified Notes</h3>
            <p className="text-slate-500 font-medium">High-quality, syllabus-aligned PDFs instantly delivered to your WhatsApp.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Edit3 size={28} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Custom Assignments</h3>
            <p className="text-slate-500 font-medium">Stuck on a project? Send us the details and we'll handle the heavy lifting.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
              <Clock size={28} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Live Tracking</h3>
            <p className="text-slate-500 font-medium">Check the real-time status of your assignment orders using your phone number.</p>
          </motion.div>
        </motion.div>

      </div>
    </PageTransition>
  );
};

export default Home;