import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ServiceHub logo', () => {
  render(<App />);

  const logo = screen.getByAltText(/servicehub logo/i);
  expect(logo).toBeInTheDocument();
});
