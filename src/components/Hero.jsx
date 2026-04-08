import React from 'react';
import { Link } from 'react-router-dom'; // Crucial for "working" buttons

const Hero = () => (
  <header className="relative pt-20 pb-16 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {/* ... (Badge code here) ... */}
      
      <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight mb-8">
        The Backbone of <br />
        <span className="text-blue-600">Your Success.</span>
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {/* Change these to Links */}
        <Link 
          to="/notes" 
          className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl active:scale-95 text-center"
        >
          Start Browsing
        </Link>
        
        <Link 
          to="/assignments" 
          className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-200 px-10 py-5 rounded-2xl font-bold text-lg hover:border-slate-300 transition-all text-center"
        >
          Submit Task
        </Link>
      </div>
    </div>
  </header>
);

export default Hero;