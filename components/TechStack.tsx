import React from 'react';

const technologies = [
  { name: 'TypeScript', color: 'text-blue-600' },
  { name: 'JavaScript', color: 'text-yellow-600' },
  { name: 'React', color: 'text-cyan-600' },
  { name: 'Tailwind CSS', color: 'text-cyan-500' },
  { name: 'Supabase', color: 'text-emerald-600' },
  { name: 'PostgreSQL', color: 'text-blue-700' },
  { name: 'Vite', color: 'text-purple-600' },
  { name: 'Vercel', color: 'text-slate-800' },
  { name: 'GitHub', color: 'text-slate-700' },
  { name: 'Framer Motion', color: 'text-pink-600' },
  { name: 'Prompt Engineering', color: 'text-orange-600' },
  { name: 'Telegram Bot API', color: 'text-blue-500' },
];

const TechStack: React.FC = () => {
  return (
    <div className="w-full bg-darker py-8 border-y border-slate-200 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-darker to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-darker to-transparent z-10 pointer-events-none"></div>

      <div className="flex whitespace-nowrap animate-scroll">
        {[...technologies, ...technologies, ...technologies].map((tech, index) => (
          <div key={index} className="mx-8 flex items-center gap-2">
            <span className={`text-lg font-bold ${tech.color} opacity-80 hover:opacity-100 transition-opacity cursor-default`}>
              {tech.name}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll {
          animation: scroll 35s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TechStack;