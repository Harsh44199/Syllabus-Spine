import React, { useState } from 'react';
import NotesGallery from '../features/NotesGallery';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { BookOpen } from 'lucide-react';

const NotesPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  if (!motion) return null; // Linter safe-guard

  return (
    <PageTransition>
      <div className="min-h-[85vh] bg-slate-50 py-10 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-16"
          >
            <div>
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 text-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm">
                   <BookOpen size={20} className="md:w-6 md:h-6" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight italic uppercase">
                  The <span className="text-blue-600">Library</span>
                </h1>
              </div>
              <p className="text-sm md:text-base text-slate-500 font-medium max-w-xl">
                Browse our premium collection of syllabus-mapped notes, available for instant digital delivery.
              </p>
            </div>
            
            {/* Professional Filter Tabs */}
            <div className="flex bg-white p-1.5 rounded-[1rem] md:rounded-[1.2rem] border border-slate-200 shadow-sm overflow-x-auto hide-scrollbar w-full md:w-auto">
              {['All', 'Digital', 'Handwritten'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`flex-1 md:flex-none px-5 py-3 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeFilter === tab 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </motion.div>

          <NotesGallery filter={activeFilter} />
        </div>
      </div>
    </PageTransition>
  );
};

export default NotesPage;