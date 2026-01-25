import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as NextAuthReactModule from 'next-auth/react';
import { makeApiErrorMock, makeApiSuccessMock } from '../../../../test-helper/makeMock';
import { makeSessionMock } from '../../__mocks__/session.mock';
import * as SendChatMessageModule from '../../_api/sendChatMessage';
import ChatWidget from '../ChatWidget';

jest.mock('../../_api/sendChatMessage');

// Mock scrollIntoView since jsdom doesn't support it
Element.prototype.scrollIntoView = jest.fn();

describe('ChatWidget', () => {
  let sendChatMessageSpy: jest.SpyInstance<
    ReturnType<typeof SendChatMessageModule.sendChatMessage>
  >;

  beforeEach(() => {
    jest
      .spyOn(NextAuthReactModule, 'useSession')
      .mockReturnValue({ data: makeSessionMock(), status: 'authenticated', update: jest.fn() });

    sendChatMessageSpy = jest
      .spyOn(SendChatMessageModule, 'sendChatMessage')
      .mockResolvedValue(makeApiSuccessMock('Hello from assistant!'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when session is not authenticated', () => {
    jest
      .spyOn(NextAuthReactModule, 'useSession')
      .mockReturnValue({ data: null, status: 'unauthenticated', update: jest.fn() });

    const { container } = render(<ChatWidget />);
    expect(container.firstChild).toBeNull();
  });

  it('should render chat widget launcher when not open', () => {
    render(<ChatWidget />);
    expect(screen.getByRole('button', { name: 'Open chat' })).toBeInTheDocument();
  });

  it('should open chat panel when launcher is clicked', async () => {
    render(<ChatWidget />);

    const launcherButton = screen.getByRole('button', { name: 'Open chat' });
    await userEvent.click(launcherButton);

    expect(screen.getByTestId('chat-widget-panel')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close chat' })).toBeInTheDocument();
  });

  it('should close chat panel when close button is clicked', async () => {
    render(<ChatWidget />);

    await userEvent.click(screen.getByRole('button', { name: 'Open chat' }));
    expect(screen.getByTestId('chat-widget-panel')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Close chat' }));
    expect(screen.queryByTestId('chat-widget-panel')).not.toBeInTheDocument();
  });

  it('should display welcome message in empty chat', async () => {
    render(<ChatWidget />);

    await userEvent.click(screen.getByRole('button', { name: 'Open chat' }));

    expect(
      screen.getByText('Ask me anything—happy memory ideas, journaling prompts, or just chat.'),
    ).toBeInTheDocument();
  });

  it('should send message and display both user and assistant messages', async () => {
    render(<ChatWidget />);

    await userEvent.click(screen.getByRole('button', { name: 'Open chat' }));

    const messageInput = screen.getByTestId('chat-widget-input');
    await userEvent.type(messageInput, 'Hello, how are you?');

    expect(screen.getByTestId('chat-widget-input')).toHaveValue('Hello, how are you?');

    await userEvent.click(screen.getByTestId('chat-widget-send'));

    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Hello from assistant!')).toBeInTheDocument();
    });

    expect(sendChatMessageSpy).toHaveBeenCalledTimes(1);
    expect(sendChatMessageSpy).toHaveBeenCalledWith({
      message: 'Hello, how are you?',
      history: [],
    });
  });

  it('should clear input after sending message', async () => {
    render(<ChatWidget />);

    await userEvent.click(screen.getByRole('button', { name: 'Open chat' }));

    const messageInput = screen.getByTestId('chat-widget-input');
    await userEvent.type(messageInput, 'Test message');
    await userEvent.click(screen.getByTestId('chat-widget-send'));

    await waitFor(() => {
      expect(messageInput).toHaveValue('');
    });
  });

  it('should disable send button when input is empty', async () => {
    render(<ChatWidget />);

    await userEvent.click(screen.getByRole('button', { name: 'Open chat' }));

    expect(screen.getByTestId('chat-widget-send')).toBeDisabled();

    const messageInput = screen.getByTestId('chat-widget-input');
    await userEvent.type(messageInput, 'Test');
    expect(screen.getByTestId('chat-widget-send')).not.toBeDisabled();
  });

  it('should disable send button while message is sending', async () => {
    sendChatMessageSpy.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(makeApiSuccessMock('Response')), 1000);
        }),
    );

    render(<ChatWidget />);

    await userEvent.click(screen.getByRole('button', { name: 'Open chat' }));

    const messageInput = screen.getByTestId('chat-widget-input');
    await userEvent.type(messageInput, 'Test');
    await userEvent.click(screen.getByTestId('chat-widget-send'));

    expect(screen.getByTestId('chat-widget-send')).toBeDisabled();
  });

  it('should send message with Enter key', async () => {
    render(<ChatWidget />);

    await userEvent.click(screen.getByRole('button', { name: 'Open chat' }));

    const messageInput = screen.getByTestId('chat-widget-input');
    await userEvent.type(messageInput, 'Hello{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    expect(sendChatMessageSpy).toHaveBeenCalledTimes(1);
  });

  it('should not send message with Shift+Enter (for new line)', async () => {
    render(<ChatWidget />);

    await userEvent.click(screen.getByRole('button', { name: 'Open chat' }));

    const messageInput = screen.getByTestId('chat-widget-input');
    await userEvent.type(messageInput, 'Line 1{Shift>}{Enter}{/Shift}Line 2');

    expect(messageInput).toHaveValue('Line 1\nLine 2');
    expect(sendChatMessageSpy).not.toHaveBeenCalled();
  });

  it('should display error message when message sending fails', async () => {
    sendChatMessageSpy.mockResolvedValue(makeApiErrorMock('Network error'));

    render(<ChatWidget />);

    await userEvent.click(screen.getByRole('button', { name: 'Open chat' }));

    const messageInput = screen.getByTestId('chat-widget-input');
    await userEvent.type(messageInput, 'Test');
    await userEvent.click(screen.getByTestId('chat-widget-send'));

    await waitFor(() => {
      expect(screen.getByRole('alert', { hidden: true })).toHaveTextContent('Network error');
    });
  });

  it('should include message history in subsequent messages', async () => {
    render(<ChatWidget />);

    await userEvent.click(screen.getByRole('button', { name: 'Open chat' }));

    const messageInput = screen.getByTestId('chat-widget-input');

    // First message
    await userEvent.type(messageInput, 'First message');
    await userEvent.click(screen.getByTestId('chat-widget-send'));

    await waitFor(() => {
      expect(screen.getByText('First message')).toBeInTheDocument();
    });

    // Second message
    sendChatMessageSpy.mockClear();
    await userEvent.type(messageInput, 'Second message');
    await userEvent.click(screen.getByTestId('chat-widget-send'));

    await waitFor(() => {
      expect(screen.getByText('Second message')).toBeInTheDocument();
    });

    expect(sendChatMessageSpy).toHaveBeenCalledWith({
      message: 'Second message',
      history: [
        { role: 'user', content: 'First message' },
        { role: 'assistant', content: 'Hello from assistant!' },
      ],
    });
  });

  it('should display loading indicator while waiting for response', async () => {
    sendChatMessageSpy.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(makeApiSuccessMock('Response')), 500);
        }),
    );

    render(<ChatWidget />);

    await userEvent.click(screen.getByRole('button', { name: 'Open chat' }));

    const messageInput = screen.getByTestId('chat-widget-input');
    await userEvent.type(messageInput, 'Test');
    await userEvent.click(screen.getByTestId('chat-widget-send'));

    expect(screen.getByText('Thinking…')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Thinking…')).not.toBeInTheDocument();
    });
  });

  it('should handle message with only whitespace', async () => {
    render(<ChatWidget />);

    await userEvent.click(screen.getByRole('button', { name: 'Open chat' }));

    const messageInput = screen.getByTestId('chat-widget-input');
    await userEvent.type(messageInput, '   ');

    expect(screen.getByTestId('chat-widget-send')).toBeDisabled();
    expect(sendChatMessageSpy).not.toHaveBeenCalled();
  });
});
