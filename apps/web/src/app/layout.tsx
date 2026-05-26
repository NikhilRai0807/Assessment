import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AppThemeProvider } from './theme-provider';

export const metadata: Metadata = {
  title: 'Salary Management',
  description: 'HR salary management dashboard',
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
