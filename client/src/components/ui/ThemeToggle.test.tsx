import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './ThemeToggle';
import ThemeProvider from '../../app/providers/ThemeProvider';
import { useThemeStore } from '../../app/store/themeStore';

describe('ThemeToggle', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'light' });
    document.documentElement.setAttribute('data-theme', 'light');
  });

  it('toggles the theme when clicked', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(useThemeStore.getState().theme).toBe('dark');
  });
});