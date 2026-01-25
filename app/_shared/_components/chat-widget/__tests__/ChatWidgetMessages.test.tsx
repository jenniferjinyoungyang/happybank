import { render, screen } from '@testing-library/react';
import { ChatWidgetMessages } from '../ChatWidgetMessages';

describe('ChatWidgetMessages', () => {
  it('should display welcome message when no messages exist', () => {
    const bottomRef = { current: null };

    render(<ChatWidgetMessages messages={[]} isSending={false} bottomRef={bottomRef} />);

    expect(
      screen.getByText('Ask me anything—happy memory ideas, journaling prompts, or just chat.'),
    ).toBeInTheDocument();
  });

  it('should display user messages on the right side', () => {
    const bottomRef = { current: null };
    const messages = [{ id: '1', role: 'user' as const, content: 'Hello' }];

    render(<ChatWidgetMessages messages={messages} isSending={false} bottomRef={bottomRef} />);

    const messageDiv = screen.getByText('Hello').closest('div');
    expect(messageDiv?.parentElement).toHaveClass('justify-end');
  });

  it('should display assistant messages on the left side', () => {
    const bottomRef = { current: null };
    const messages = [{ id: '1', role: 'assistant' as const, content: 'Hi there!' }];

    render(<ChatWidgetMessages messages={messages} isSending={false} bottomRef={bottomRef} />);

    const messageDiv = screen.getByText('Hi there!').closest('div');
    expect(messageDiv?.parentElement).toHaveClass('justify-start');
  });

  it('should display multiple messages in correct order', () => {
    const bottomRef = { current: null };
    const messages = [
      { id: '1', role: 'user' as const, content: 'First message' },
      { id: '2', role: 'assistant' as const, content: 'Response 1' },
      { id: '3', role: 'user' as const, content: 'Second message' },
      { id: '4', role: 'assistant' as const, content: 'Response 2' },
    ];

    render(<ChatWidgetMessages messages={messages} isSending={false} bottomRef={bottomRef} />);

    const allText = screen.getByTestId('chat-widget-messages').textContent;
    expect(allText?.indexOf('First message')).toBeLessThan(allText?.indexOf('Response 1') ?? 0);
    expect(allText?.indexOf('Response 1')).toBeLessThan(allText?.indexOf('Second message') ?? 0);
    expect(allText?.indexOf('Second message')).toBeLessThan(allText?.indexOf('Response 2') ?? 0);
  });

  it('should display loading indicator when isSending is true', () => {
    const bottomRef = { current: null };

    render(<ChatWidgetMessages messages={[]} isSending bottomRef={bottomRef} />);

    expect(screen.getByText('Thinking…')).toBeInTheDocument();
  });

  it('should not display loading indicator when isSending is false', () => {
    const bottomRef = { current: null };

    render(<ChatWidgetMessages messages={[]} isSending={false} bottomRef={bottomRef} />);

    expect(screen.queryByText('Thinking…')).not.toBeInTheDocument();
  });

  it('should handle multiline messages', () => {
    const bottomRef = { current: null };
    const messages = [
      {
        id: '1',
        role: 'assistant' as const,
        content: 'Line 1\nLine 2\nLine 3',
      },
    ];

    const { container } = render(
      <ChatWidgetMessages messages={messages} isSending={false} bottomRef={bottomRef} />,
    );

    // Check that the multiline content is rendered
    expect(container.textContent).toContain('Line 1');
    expect(container.textContent).toContain('Line 2');
    expect(container.textContent).toContain('Line 3');
  });

  it('should render correct data-testid for messages container', () => {
    const bottomRef = { current: null };

    const { container } = render(
      <ChatWidgetMessages messages={[]} isSending={false} bottomRef={bottomRef} />,
    );

    expect(container.querySelector('[data-testid="chat-widget-messages"]')).toBeInTheDocument();
  });

  it('should apply correct styling classes to user message bubble', () => {
    const bottomRef = { current: null };
    const messages = [{ id: '1', role: 'user' as const, content: 'Test' }];

    render(<ChatWidgetMessages messages={messages} isSending={false} bottomRef={bottomRef} />);

    const messageBubble = screen.getByText('Test');
    expect(messageBubble.className).toContain('bg-indigo-600');
    expect(messageBubble.className).toContain('text-white');
    expect(messageBubble.className).toContain('rounded-br-md');
  });

  it('should apply correct styling classes to assistant message bubble', () => {
    const bottomRef = { current: null };
    const messages = [{ id: '1', role: 'assistant' as const, content: 'Test' }];

    render(<ChatWidgetMessages messages={messages} isSending={false} bottomRef={bottomRef} />);

    const messageBubble = screen.getByText('Test');
    expect(messageBubble.className).toContain('bg-white');
    expect(messageBubble.className).toContain('text-gray-900');
    expect(messageBubble.className).toContain('rounded-bl-md');
  });
});
