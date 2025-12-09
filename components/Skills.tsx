import React from 'react';
import { Layout, Share2, TrendingUp, Code2, Zap, PenTool } from 'lucide-react';
import Reveal from './Reveal';

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-24 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Keahlian & Kompetensi</h2>
            <p className="text-slate-600 text-lg">
              Kombinasi unik antara pemahaman bisnis, kreativitas konten, dan kemampuan teknis.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Business & Strategy */}
          <Reveal delay={0.1}>
            <div className="h-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-primary rounded-xl flex items-center justify-center mb-6">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Bisnis & Manajemen</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3"></div>
                  <div>
                    <span className="block font-medium text-slate-800">Community Management</span>
                    <span className="text-sm text-slate-500">Owner & Admin Grup Aktif</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3"></div>
                  <div>
                    <span className="block font-medium text-slate-800">Digital Marketing</span>
                    <span className="text-sm text-slate-500">Latar Belakang SMK & Kuliah</span>
                  </div>
                </li>
                 <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3"></div>
                  <div>
                    <span className="block font-medium text-slate-800">Business Operations</span>
                    <span className="text-sm text-slate-500">Manajemen Toko & Stok</span>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Creative Content */}
          <Reveal delay={0.2}>
            <div className="h-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <PenTool size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Kreatif & Konten</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <span className="block font-medium text-slate-800">Meme Creation</span>
                    <span className="text-sm text-slate-500">Viral Content Specialist (Sejak 2013)</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <span className="block font-medium text-slate-800">Content Strategy</span>
                    <span className="text-sm text-slate-500">Engagement & Brand Awareness</span>
                  </div>
                </li>
                 <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <span className="block font-medium text-slate-800">Copywriting</span>
                    <span className="text-sm text-slate-500">Humoris & Persuasif</span>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Tech & Tools */}
          <Reveal delay={0.3}>
            <div className="h-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Code2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Teknologi Web</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <span className="block font-medium text-slate-800">Fullstack Web Dev</span>
                    <span className="text-sm text-slate-500">React, TypeScript, Tailwind</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <span className="block font-medium text-slate-800">Automation</span>
                    <span className="text-sm text-slate-500">n8n Workflow Beginner</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <span className="block font-medium text-slate-800">Vibe Coding</span>
                    <span className="text-sm text-slate-500">Coding with flow & passion</span>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
};

export default Skills;