import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidgetLauncher } from '../ChatWidgetLauncher';

describe('ChatWidgetLauncher', () => {
  it('should render launcher button', () => {
    render(<ChatWidgetLauncher onOpen={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Open chat' })).toBeInTheDocument();
  });

  it('should have correct data-testid', () => {
    render(<ChatWidgetLauncher onOpen={jest.fn()} />);

    expect(screen.getByTestId('chat-widget-launcher')).toBeInTheDocument();
  });

  it('should call onOpen when clicked', async () => {
    const onOpen = jest.fn();
    render(<ChatWidgetLauncher onOpen={onOpen} />);

    const button = screen.getByRole('button', { name: 'Open chat' });
    await userEvent.click(button);

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('should display chat icon', () => {
    const { container } = render(<ChatWidgetLauncher onOpen={jest.fn()} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    const { container } = render(<ChatWidgetLauncher onOpen={jest.fn()} />);

    const button = container.querySelector('button');
    expect(button).toHaveClass('rounded-full', 'bg-indigo-600', 'shadow-lg');
  });

  it('should be a button type element', () => {
    render(<ChatWidgetLauncher onOpen={jest.fn()} />);

    const button = screen.getByRole('button', { name: 'Open chat' });
    expect(button).toHaveAttribute('type', 'button');
  });
});
