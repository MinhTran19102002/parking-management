import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AppProvider } from './context';
import { BrowserRouter } from 'react-router-dom';
import CustomAntdTheme from './shared/CustomAntdTheme.js';
import { ConfigProvider, theme } from 'antd';
import vi_VN from 'antd/locale/vi_VN';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

function GlobalConfig({}) {
  return (
    <AppProvider>
      <BrowserRouter>
        <ConfigProvider locale={vi_VN} {...getAntd()}>
          <QueryClientProvider client={queryClient}>
            <CustomAntdTheme />
            <App />
          </QueryClientProvider>
        </ConfigProvider>
      </BrowserRouter>
    </AppProvider>
  );
}

const getAntd = () => {
  return {
    theme: {
      algorithm: theme.darkAlgorithm,
      token: {
        neutral5: '#D9D9D9',
        event: {
          in: ['#389e0d', '#d9f7be'],
          out: ['#1d39c4', '#d6e4ff'],
          entry: ['#389e0d', '#d9f7be'],
          exit: ['#1d39c4', '#d6e4ff'],
          almost_full: ['#d48806', '#fff1b8'],
          parking_full: ['#c41d7f', '#ffd6e7']
        }
      }
    }
  };
};

const themeByMode = {
  light: {
    neutral5: '#D9D9D9',
    event: {
      in: ['#389e0d', '#d9f7be'],
      out: ['#1d39c4', '#d6e4ff'],
      entry: ['#389e0d', '#d9f7be'],
      exit: ['#1d39c4', '#d6e4ff'],
      almost_full: ['#d48806', '#fff1b8'],
      parking_full: ['#c41d7f', '#ffd6e7']
    }
  },
  dark: {
    neutral5: '#D9D9D9',
    event: {
      in: ['#389e0d', '#d9f7be'],
      out: ['#1d39c4', '#d6e4ff'],
      entry: ['#389e0d', '#d9f7be'],
      exit: ['#1d39c4', '#d6e4ff'],
      almost_full: ['#d48806', '#fff1b8'],
      parking_full: ['#c41d7f', '#ffd6e7']
    }
  }
};

export default GlobalConfig;
