import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidgetComposer } from '../ChatWidgetComposer';

describe('ChatWidgetComposer', () => {
  it('should render textarea input', () => {
    render(
      <ChatWidgetComposer
        draft=""
        setDraft={jest.fn()}
        isSending={false}
        canSend={false}
        onSend={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByTestId('chat-widget-input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type a message…')).toBeInTheDocument();
  });

  it('should update draft value on input change', async () => {
    const setDraft = jest.fn();
    render(
      <ChatWidgetComposer
        draft=""
        setDraft={setDraft}
        isSending={false}
        canSend={false}
        onSend={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    const input = screen.getByTestId('chat-widget-input');
    await userEvent.type(input, 'Hello');

    // setDraft should be called multiple times as user types (once per character)
    expect(setDraft.mock.calls.length).toBeGreaterThan(0);
    // Verify it was called with individual characters
    expect(setDraft).toHaveBeenCalledWith('H');
    expect(setDraft).toHaveBeenCalledWith('e');
  });

  it('should display current draft value', () => {
    render(
      <ChatWidgetComposer
        draft="Test message"
        setDraft={jest.fn()}
        isSending={false}
        canSend
        onSend={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByTestId('chat-widget-input')).toHaveValue('Test message');
  });

  it('should disable input when sending', () => {
    render(
      <ChatWidgetComposer
        draft="Test"
        setDraft={jest.fn()}
        isSending
        canSend={false}
        onSend={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByTestId('chat-widget-input')).toBeDisabled();
  });

  it('should disable send button when canSend is false', () => {
    render(
      <ChatWidgetComposer
        draft=""
        setDraft={jest.fn()}
        isSending={false}
        canSend={false}
        onSend={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByTestId('chat-widget-send')).toBeDisabled();
  });

  it('should enable send button when canSend is true', () => {
    render(
      <ChatWidgetComposer
        draft="Test"
        setDraft={jest.fn()}
        isSending={false}
        canSend
        onSend={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByTestId('chat-widget-send')).not.toBeDisabled();
  });

  it('should call onSend when Enter key is pressed', async () => {
    const onSend = jest.fn();
    render(
      <ChatWidgetComposer
        draft="Test"
        setDraft={jest.fn()}
        isSending={false}
        canSend
        onSend={onSend}
        onSubmit={jest.fn()}
      />,
    );

    const input = screen.getByTestId('chat-widget-input');
    await userEvent.type(input, '{Enter}');

    expect(onSend).toHaveBeenCalled();
  });

  it('should not call onSend when Shift+Enter is pressed', async () => {
    const onSend = jest.fn();
    render(
      <ChatWidgetComposer
        draft="Test"
        setDraft={jest.fn()}
        isSending={false}
        canSend
        onSend={onSend}
        onSubmit={jest.fn()}
      />,
    );

    const input = screen.getByTestId('chat-widget-input');
    await userEvent.type(input, '{Shift>}{Enter}{/Shift}');

    expect(onSend).not.toHaveBeenCalled();
  });

  it('should call onSubmit when send button is clicked', async () => {
    const onSubmit = jest.fn();
    render(
      <ChatWidgetComposer
        draft="Test"
        setDraft={jest.fn()}
        isSending={false}
        canSend
        onSend={jest.fn()}
        onSubmit={onSubmit}
      />,
    );

    const sendButton = screen.getByTestId('chat-widget-send');
    await userEvent.click(sendButton);

    expect(onSubmit).toHaveBeenCalled();
  });

  it('should display keyboard shortcut help text', () => {
    const { container } = render(
      <ChatWidgetComposer
        draft=""
        setDraft={jest.fn()}
        isSending={false}
        canSend={false}
        onSend={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    // Check that help text paragraph exists and contains key text
    const helpTextParagraph = container.querySelector('p.mt-2');
    expect(helpTextParagraph).toBeInTheDocument();
    expect(helpTextParagraph?.textContent).toContain('Press');
    expect(helpTextParagraph?.textContent).toContain('Enter');
    expect(helpTextParagraph?.textContent).toContain('Shift');
  });
});
