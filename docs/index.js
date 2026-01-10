import React from 'react';
import { createRoot } from 'react-dom/client';
import Docs from './docs';
import '../src/styles/glide.css';
import '../src/styles/glide-theme.css';
import './docs.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Docs />
  </React.StrictMode>
);
