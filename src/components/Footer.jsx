import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

        {/* Brand Info */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="text-xl font-bold text-slate-900">
              Syllabus<span className="text-blue-600">Spine</span>
            </span>
          </div>
          <p className="text-slate-500 max-w-sm leading-relaxed font-medium">
            The backbone of your academic success. Delivering premium, syllabus-mapped notes and expert assignment fulfillment for serious students.
          </p>
        </div>

        {/* Student Resources (All Admin links removed) */}
        <div>
          <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-widest">Resources</h4>
          <ul className="space-y-4 text-sm font-semibold text-slate-500">
            <li><Link to="/notes" className="hover:text-blue-600 transition-colors">Study Library</Link></li>
            <li><Link to="/assignments" className="hover:text-blue-600 transition-colors">Request Assignment</Link></li>
            <li><Link to="/track-order" className="text-blue-600 hover:text-blue-700 transition-colors font-bold">Track Order Status</Link></li>
          </ul>
        </div>

      </div>

      {/* Copyright & Bottom Bar */}
      <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-tighter">
        <p>© 2026 Syllabus Spine Operations. All Rights Reserved.</p>
        <div className="flex gap-6">
          <a href="/" target="_blank" class="hover:text-blue-600 cursor-pointer">
            <span class="font-medium">Instagram</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;