/** @jsx React.createElement */
// @ts-nocheck
import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { Beaker } from 'lucide-react';

// 🚀 核心：路径全部对齐为新后缀 .jsx
import Dashboard from './pages/Dashboard.jsx';
import TargetID from './pages/TargetID.jsx';
import KnowledgeGraph from './pages/KnowledgeGraph.jsx';

const Navbar = () => (
  <nav className="bg-white border-b border-slate-200 px-4 flex justify-between h-16 items-center">
    <Link to="/" className="flex items-center gap-2">
      <div className="p-2 bg-indigo-600 rounded text-white"><Beaker size={20} /></div>
      <span className="text-xl font-bold">DermAI</span>
    </Link>
    <div className="flex gap-4">
      <Link to="/" className="text-sm font-bold text-slate-600">药研中心</Link>
      <Link to="/target-id" className="text-sm font-bold text-slate-600">靶点识别</Link>
      <Link to="/knowledge-graph" className="text-sm font-bold text-slate-600">知识图谱</Link>
    </div>
  </nav>
);

const App = () => (
  <HashRouter>
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/target-id" element={<TargetID />} />
          <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  </HashRouter>
);

export default App;
