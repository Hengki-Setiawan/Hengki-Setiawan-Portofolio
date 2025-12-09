import React from 'react';

const techs = [
  { name: 'React', color: 'text-blue-500' },
  { name: 'TypeScript', color: 'text-blue-600' },
  { name: 'Tailwind CSS', color: 'text-cyan-400' },
  { name: 'n8n', color: 'text-red-500' },
  { name: 'Node.js', color: 'text-green-600' },
  { name: 'Canva Pro', color: 'text-purple-500' },
  { name: 'CapCut', color: 'text-slate-900' },
  { name: 'Business Strategy', color: 'text-orange-500' },
  { name: 'Community Mgmt', color: 'text-indigo-500' },
];

const TechStack: React.FC = () => {
  return (
    <div className="w-full bg-slate-900 py-10 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10"></div>
      
      <div className="flex whitespace-nowrap animate-scroll">
        {/* Duplicate list 3 times to ensure smooth infinite loop */}
        {[...techs, ...techs, ...techs].map((tech, index) => (
          <div key={index} className="mx-8 flex items-center gap-2">
            <span className={`text-xl md:text-2xl font-bold ${tech.color} opacity-80 hover:opacity-100 transition-opacity`}>
              {tech.name}
            </span>
            <span className="text-slate-700 mx-2">•</span>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TechStack;