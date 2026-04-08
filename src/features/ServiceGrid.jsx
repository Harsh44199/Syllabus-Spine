import React from 'react';

const services = [
  {
    title: "Digital Notes",
    desc: "Instant PDF downloads of verified topper notes for all semester subjects.",
    icon: "⚡",
    color: "bg-blue-500"
  },
  {
    title: "Handwritten Delivery",
    desc: "Premium physical notebooks written by experts, delivered to your hostel or home.",
    icon: "📦",
    color: "bg-indigo-600"
  },
  {
    title: "Assignment Help",
    desc: "Custom-written assignments following your specific university guidelines.",
    icon: "📝",
    color: "bg-slate-900"
  }
];

const ServiceGrid = () => (
  <div id="services" className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {services.map((s, i) => (
      <div key={i} className="relative group p-8 bg-white rounded-3xl border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-2xl text-white mb-6 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform`}>
          {s.icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
        <p className="text-slate-500 leading-relaxed mb-6">{s.desc}</p>
        <button className="text-sm font-bold text-blue-600 flex items-center gap-2 group-hover:gap-3 transition-all">
          Explore Service <span>→</span>
        </button>
      </div>
    ))}
  </div>
);

export default ServiceGrid;