import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidgetHeader } from '../ChatWidgetHeader';

describe('ChatWidgetHeader', () => {
  it('should render header title', () => {
    render(<ChatWidgetHeader onClose={jest.fn()} />);

    expect(screen.getByText('HappyBank Chat')).toBeInTheDocument();
  });

  it('should render close button', () => {
    render(<ChatWidgetHeader onClose={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Close chat' })).toBeInTheDocument();
  });

  it('should display chat icon', () => {
    const { container } = render(<ChatWidgetHeader onClose={jest.fn()} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const onClose = jest.fn();
    render(<ChatWidgetHeader onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: 'Close chat' });
    await userEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should have correct data-testid on close button', () => {
    render(<ChatWidgetHeader onClose={jest.fn()} />);

    expect(screen.getByTestId('chat-widget-close')).toBeInTheDocument();
  });

  it('should render with proper semantic structure', () => {
    const { container } = render(<ChatWidgetHeader onClose={jest.fn()} />);

    const header = container.firstChild;
    expect(header).toHaveClass('flex', 'items-center', 'justify-between');
  });
});
