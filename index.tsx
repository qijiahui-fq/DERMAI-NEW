// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom/client';

// 🚀 关键修改：必须加上 .tsx 后缀，否则云端会报 404
import App from './App.tsx'; 

const mountApp = () => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountApp);
} else {
    mountApp();
}
