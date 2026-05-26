import { render, screen } from '@testing-library/react';

import HomePage from '../src/app/page';

describe('home page', () => {
  it('renders the scaffolding message', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', {
        name: /hr dashboard scaffolding is ready/i,
      }),
    ).toBeInTheDocument();
  });
});
