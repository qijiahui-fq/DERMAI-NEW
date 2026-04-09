// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom/client';
// 🚀 确保带后缀
import App from './App.tsx'; 

const mountApp = () => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
        const root = ReactDOM.createRoot(rootElement);
        root.render(<App />);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountApp);
} else {
    mountApp();
}
