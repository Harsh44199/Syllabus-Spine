import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Imported useNavigate
import { motion } from 'framer-motion';
import { BookOpen, Edit3, Clock, ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { supabase } from '../lib/supabase'; // 2. Imported Supabase

const Home = () => {
  const navigate = useNavigate(); // 3. Initialized the navigator
  if (!motion) return null;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  // 4. THE AUTH GUARD FOR ASSIGNMENTS
  const handleOrderClick = async () => {
    // getUser() forces a strict server check, ignoring dead local sessions
    const { data: { user }, error } = await supabase.auth.getUser();

    if (user && !error) {
      navigate('/assignments');
    } else {
      // Clear out any corrupted local storage just to be safe
      await supabase.auth.signOut();
      navigate('/login');
    }
  };

  return (
    <PageTransition>
      <div className="h-auto bg-slate-50 flex flex-col items-center px-4 sm:px-6 pt-10 pb-16 md:pt-24 md:pb-32">

        {/* HERO SECTION */}
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-28 mt-4 md:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[9px] sm:text-xs md:text-sm mb-6 md:mb-8"
          >
            <span className="relative flex h-2 w-2 md:h-3 md:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-blue-500"></span>
            </span>
            PREMIUM STUDY MATERIALS
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[2.25rem] leading-[1.15] sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-5 md:mb-8 md:leading-[1.1]"
          >
            Master Your Syllabus. <br className="hidden sm:block" />
            <span className="text-blue-600 block sm:inline mt-1 sm:mt-0">Save Your Time.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base md:text-xl text-slate-500 font-medium max-w-xl mx-auto mb-8 md:mb-10 px-2"
          >
            Get instant access to top-tier notes or hire us to handle your complex assignments so you can focus on what actually matters.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 w-full max-w-xs mx-auto sm:max-w-none"
          >
            <Link to="/notes" className="w-full sm:w-auto">
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full px-6 py-3.5 md:px-8 md:py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 flex items-center justify-center gap-2 text-sm md:text-base transition-colors hover:bg-blue-700"
              >
                BROWSE LIBRARY <ArrowRight size={18} />
              </motion.button>
            </Link>

            {/* 5. REPLACED LINK WITH OUR SMART BUTTON */}
            <motion.button
              onClick={handleOrderClick}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-black hover:bg-slate-50 text-sm md:text-base transition-colors"
            >
              ORDER ASSIGNMENT
            </motion.button>

          </motion.div>
        </div>

        {/* FEATURES GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 w-full"
        >
          <FeatureCard
            variants={itemVariants}
            icon={<BookOpen className="w-5 h-5 md:w-6 md:h-6" />}
            color="blue"
            title="Verified Notes"
            desc="High-quality, syllabus-aligned PDFs instantly delivered to your WhatsApp."
          />
          <FeatureCard
            variants={itemVariants}
            icon={<Edit3 className="w-5 h-5 md:w-6 md:h-6" />}
            color="purple"
            title="Custom Assignments"
            desc="Stuck on a project? Send us the details and we'll handle the heavy lifting."
          />
          <FeatureCard
            variants={itemVariants}
            icon={<Clock className="w-5 h-5 md:w-6 md:h-6" />}
            color="green"
            title="Live Tracking"
            desc="Check the real-time status of your assignment orders using your phone number."
          />
        </motion.div>

      </div>
    </PageTransition>
  );
};

/**
 * FeatureCard Component
 */
const FeatureCard = ({ variants, icon, color, title, desc }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600"
  };

  return (
    <motion.div
      variants={variants}
      className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm active:scale-[0.98] transition-transform flex flex-col items-center text-center md:items-start md:text-left"
    >
      <div className={`w-12 h-12 md:w-14 md:h-14 ${colorMap[color]} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6`}>
        {icon}
      </div>
      <h3 className="text-[1.1rem] md:text-xl font-black text-slate-900 mb-2 md:mb-3">{title}</h3>
      <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
};

export default Home;