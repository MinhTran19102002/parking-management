import React, { useContext, useEffect, useState } from 'react';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import CustomAntdTheme from './shared/CustomAntdTheme.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppContext from './context';
import { I18nextProvider } from 'react-i18next';
import i18next from './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: 1,
      staleTime: 5 * (60 * 1000), // 5 mins
      cacheTime: 10 * (60 * 1000) // 10 mins
    }
  }
});

function GlobalConfig({}) {
  return (
    <BrowserRouter>
        <I18nextProvider i18n={i18next}>
          <QueryClientProvider client={queryClient}>
            <CustomAntdTheme />
            <App />
          </QueryClientProvider>
        </I18nextProvider>
    </BrowserRouter>
  );
}

export default GlobalConfig;
