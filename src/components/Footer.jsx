import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, MessageCircle, Mail, ExternalLink } from 'lucide-react';

const Footer = () => {
  // Linter safe-guard must be here if no hooks are used, otherwise after hooks!
  if (!motion) return null; 
  
  return (
    <footer className="bg-white border-t border-slate-200 pt-10 md:pt-16 pb-6 md:pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* TOP SECTION: 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-10 md:mb-16">

          {/* Brand Info - Takes up half on desktop */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">
                S
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
                Syllabus<span className="text-blue-600">Spine</span>
              </span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed font-medium text-sm md:text-base">
              The backbone of your academic success. Delivering premium, syllabus-mapped notes and expert assignment fulfillment for serious students.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-black text-slate-900 mb-4 md:mb-6 text-xs uppercase tracking-[0.2em]">Resources</h4>
            <ul className="space-y-3 md:space-y-4 text-sm font-bold text-slate-500">
              <li>
                <Link to="/notes" className="hover:text-blue-600 transition-all flex items-center gap-2 group">
                  Study Library <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/assignments" className="hover:text-blue-600 transition-all flex items-center gap-2 group">
                  Request Assignment <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                  Track Order Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Support / Contact */}
          <div className="md:col-span-3">
            <h4 className="font-black text-slate-900 mb-4 md:mb-6 text-xs uppercase tracking-[0.2em]">Support</h4>
            <ul className="space-y-3 md:space-y-4 text-sm font-bold text-slate-500">
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <Mail size={16} />
                </div>
                <a href="mailto:syllabusspine@gmail.com" className="hover:text-slate-900 transition-colors">syllabusspine@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
                  <MessageCircle size={16} />
                </div>
                <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noreferrer" className="hover:text-slate-900 text-green-600 transition-colors">WhatsApp Help</a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION: Copyright & Socials */}
        <div className="pt-6 md:pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest text-center md:text-left">
            © 2026 SYLLABUS SPINE OPERATIONS. <br className="md:hidden" /> ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-4">
            {/* Social Icons with Hover States */}
            <motion.a 
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.9 }}
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-pink-50 hover:text-pink-600 transition-colors shadow-sm"
            >
              <Camera size={20} />
            </motion.a>
            
            <motion.a 
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.9 }}
              href="mailto:syllabusspine@gmail.com" 
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm"
            >
              <Mail size={20} />
            </motion.a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;