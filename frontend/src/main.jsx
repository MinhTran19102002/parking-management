import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalConfig from './GlobalConfig.jsx';
import { AppProvider } from './context/index.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppProvider>
    <GlobalConfig />
  </AppProvider>
);
