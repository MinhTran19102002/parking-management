import React, { useContext, useEffect, useState } from 'react';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import CustomAntdTheme from './shared/CustomAntdTheme.js';
import { ConfigProvider, theme } from 'antd';
import vi_VN from 'antd/locale/vi_VN';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppContext from './context';
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
  const { state } = useContext(AppContext);
  const [customedAntdTheem, setCustomedAntTheme] = useState(getAntd(state.theme));

  useEffect(() => {
    setCustomedAntTheme(getAntd(state.theme));
  }, [state.theme]);

  return (
    <BrowserRouter>
      <ConfigProvider locale={vi_VN} {...customedAntdTheem}>
        <QueryClientProvider client={queryClient}>
          <CustomAntdTheme />
          <App />
        </QueryClientProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
}

const getAntd = (mode) => {
  return {
    theme: {
      algorithm: mode === 'dark' && theme.darkAlgorithm,
      token: themeByMode[mode]
    }
  };
};

const themeByMode = {
  light: {
    neutral5: '#D9D9D9',
    event: {
      in: ['#389e0d', '#d9f7be'],
      inSlot: ['#389e0d', '#d9f7be'],
      out: ['#1d39c4', '#d6e4ff'],
      outSlot: ['#1d39c4', '#d6e4ff'],
      entry: ['#389e0d', '#d9f7be'],
      exit: ['#1d39c4', '#d6e4ff'],
      almost_full: ['#d48806', '#fff1b8'],
      parking_full: ['#c41d7f', '#ffd6e7']
    }
  },
  dark: {
    neutral5: '#D9D9D9',
    event: {
      in: ['#52c41a', '#237804'],
      inSlot: ['#52c41a', '#237804'],
      out: ['#4096ff', '#002c8c'],
      outSlot: ['#4096ff', '#002c8c'],
      entry: ['#389e0d', '#d9f7be'],
      exit: ['#1d39c4', '#d6e4ff'],
      almost_full: ['#d48806', '#fff1b8'],
      parking_full: ['#c41d7f', '#ffd6e7']
    }
  }
};

export default GlobalConfig;
