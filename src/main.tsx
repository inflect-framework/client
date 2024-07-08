import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { darkTheme, lightTheme } from './components/theme';

function Main() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = React.useState(prefersDarkMode);

  React.useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const theme = React.useMemo(
    () => (darkMode ? darkTheme : lightTheme),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  // <React.StrictMode>
  <Main />
  // </React.StrictMode>
);
