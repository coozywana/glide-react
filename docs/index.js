import React from 'react';
import { createRoot } from 'react-dom/client';
import Docs from './docs';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Docs />
  </React.StrictMode>
);
