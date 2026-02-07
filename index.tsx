import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Failed to find the root element');
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Fatal Initialization Error:', error);
    rootElement.innerHTML = `
      <div style="height: 100vh; background: #020617; color: white; display: flex; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; padding: 20px;">
        <div style="background: #0f172a; padding: 40px; border-radius: 20px; border: 1px solid #1e293b; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          <h1 style="color: #ef4444; margin-bottom: 10px; font-size: 24px;">Application Error</h1>
          <p style="color: #94a3b8; max-width: 400px; line-height: 1.6;">The website failed to load due to a local data conflict. Please reset your data to fix this.</p>
          <div style="display: flex; gap: 10px; justify-content: center; margin-top: 30px;">
              <button onclick="localStorage.clear(); window.location.reload();" style="padding: 12px 24px; background: #7c3aed; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">Reset & Fix</button>
              <button onclick="window.location.reload();" style="padding: 12px 24px; background: #334155; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">Reload</button>
          </div>
        </div>
      </div>
    `;
  }
}