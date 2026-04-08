import React, { useState } from 'react';
import NotesGallery from '../features/NotesGallery';

const NotesPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">The Library</h1>
          <p className="text-slate-500 font-medium">Browse our premium collection of syllabus-mapped notes.</p>
        </div>
        
        {/* Professional Filter Tabs */}
        <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl">
          {['All', 'Digital', 'Handwritten'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeFilter === tab 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <NotesGallery filter={activeFilter} />
    </div>
  );
};

export default NotesPage;