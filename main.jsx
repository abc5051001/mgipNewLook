import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './lib/identity-redirect'

const root = document.getElementById('root');
const application = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
if (root.dataset.prerendered === 'true') hydrateRoot(root, application);
else createRoot(root).render(application);
