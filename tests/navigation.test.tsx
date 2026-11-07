import { StrictMode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import App from '../src/App';

function renderApp(path = '/') {
  return render(
    <StrictMode>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </StrictMode>,
  );
}

test('repeated menu navigation keeps exactly one shared header and footer', async () => {
  const user = userEvent.setup();
  renderApp();
  const originalHeader = screen.getByRole('banner');
  for (const name of [
    '출품작',
    '아티스트',
    '현재 전시',
    '갤러리 안내',
    '아티스트',
    '출품작',
    '현재 전시',
  ]) {
    const navigation = screen.getByRole('navigation', { name: '주 메뉴' });
    await user.click(within(navigation).getByRole('link', { name }));
    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(screen.getByRole('banner')).toBe(originalHeader);
    expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
    expect(screen.getAllByRole('main')).toHaveLength(1);
    const current = within(navigation).getByRole('link', { name });
    expect(current.getAttribute('aria-current')).toBe('page');
  }
});

test('mobile menu closes after navigation without remounting the header', async () => {
  const user = userEvent.setup();
  renderApp();
  const originalHeader = screen.getByRole('banner');
  for (const name of ['아티스트', '출품작', '현재 전시']) {
    await user.click(screen.getByRole('button', { name: '메뉴' }));
    const mobile = screen.getByRole('navigation', { name: '모바일 메뉴' });
    await user.click(within(mobile).getByRole('link', { name }));
    expect(
      screen.queryByRole('navigation', { name: '모바일 메뉴' }),
    ).toBeNull();
    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(screen.getByRole('banner')).toBe(originalHeader);
  }
});
