'use client';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { ReactNode } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#155eef',
    },
    secondary: {
      main: '#0f766e',
    },
    background: {
      default: '#f8fafc',
    },
  },
});

type AppThemeProviderProps = Readonly<{
  children: ReactNode;
}>;

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
