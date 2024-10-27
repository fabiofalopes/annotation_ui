import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

try {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error rendering the app:', error);
  document.body.innerHTML = '<h1>An error occurred while loading the application. Please check the console for more details.</h1>';
}