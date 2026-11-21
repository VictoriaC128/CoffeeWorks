import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { hydrateFromNative } from './platform/storage';

// Fonts are bundled so the app works offline on the phone.
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import '@fontsource-variable/lexend';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/fredoka';
import './index.css';

// Native storage is the source of truth on Android/iOS: load it before the first render.
hydrateFromNative().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
