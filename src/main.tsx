import React from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntApp } from 'antd';
import App from './App';
import { AuthProvider } from './context/AuthContextProvider';
import 'antd/dist/reset.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AntApp>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AntApp>
  </React.StrictMode>
);
