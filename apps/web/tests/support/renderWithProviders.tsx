import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

import { AppThemeProvider } from '../../src/app/theme-provider';

export const renderWithProviders = (ui: ReactElement) =>
  render(<AppThemeProvider>{ui}</AppThemeProvider>);
