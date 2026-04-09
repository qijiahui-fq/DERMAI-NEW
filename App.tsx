/** @jsx React.createElement */
// @ts-nocheck
import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Beaker } from 'lucide-react';

import Dashboard from './pages/Dashboard.tsx';
import TargetID from './pages/TargetID.tsx';
import KnowledgeGraph from './pages/KnowledgeGraph.tsx';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-indigo-600 rounded-lg text-white group-hover:rotate-12 transition-transform">
                <Beaker className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-slate-800 tracking-tight">DermAI</span>
            </Link>
            <div className="flex items-center gap-1 text-sm font-bold">
              <Link to="/" className="px-4 py-2 text-slate-500 hover:text-indigo-600">药研中心</Link>
              <Link to="/target-id" className="px-4 py-2 text-slate-500 hover:text-indigo-600">靶点识别</Link>
              <Link to="/knowledge-graph" className="px-4 py-2 text-slate-500 hover:text-indigo-600">知识图谱</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/target-id" element={<TargetID />} />
            <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
