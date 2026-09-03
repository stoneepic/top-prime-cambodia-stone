import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('App interactions', () => {
  it('switches all hero copy to Chinese', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '中文' }));
    expect(screen.getByRole('heading', { name: '柬埔寨石材，连接世界建筑。' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '获取报价' })).toBeInTheDocument();
  });

  it('opens and closes a material lightbox', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Cambodia Black/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Close/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the quarry slider and factory steps', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Where the stone begins.', exact: true })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Quarry image slides' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Factory image slides' })).toBeInTheDocument();
    expect(screen.getByText('Diamond Cutters', { exact: true })).toBeInTheDocument();
    expect(screen.getByText('Automatic Polishing', { exact: true })).toBeInTheDocument();
    expect(screen.getByText('Loading Dock', { exact: true })).toBeInTheDocument();
  });

  it('shows the success message after a valid inquiry', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText(/Your name/i), 'Alex');
    await user.type(screen.getByLabelText(/Email/i), 'alex@example.com');
    await user.click(screen.getByRole('button', { name: /Submit Inquiry/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/Thank you/i);
  });

  it('shows the verified contact channels as actionable links', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: 'sales@topprimestone.com' })).toHaveAttribute('href', 'mailto:sales@topprimestone.com');
    const numbers = screen.getAllByRole('link', { name: '+86 13806008760' });
    expect(numbers.map((link) => link.getAttribute('href'))).toEqual([
      'tel:+8613806008760',
      'https://wa.me/8613806008760',
    ]);
  });
});
