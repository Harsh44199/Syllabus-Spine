import React from 'react';

const ServiceCard = ({ title, desc, icon, color }) => (
  <div className="relative group p-8 bg-white rounded-3xl border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-2xl text-white mb-6 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed mb-6">{desc}</p>
    <button className="text-sm font-bold text-blue-600 flex items-center gap-2 group-hover:gap-3 transition-all">
      Explore Service <span>→</span>
    </button>
  </div>
);

export default ServiceCard;