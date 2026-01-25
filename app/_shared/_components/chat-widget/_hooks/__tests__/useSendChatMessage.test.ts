import { act, renderHook, waitFor } from '@testing-library/react';
import * as SendChatMessageModule from '../../../../_api/sendChatMessage';
import { useSendChatMessage } from '../useSendChatMessage';

jest.mock('../../../../_api/sendChatMessage');

describe('useSendChatMessage', () => {
  let sendChatMessageSpy: jest.SpyInstance<
    ReturnType<typeof SendChatMessageModule.sendChatMessage>
  >;

  beforeEach(() => {
    sendChatMessageSpy = jest
      .spyOn(SendChatMessageModule, 'sendChatMessage')
      .mockResolvedValue({ isSuccess: true, data: 'Test response' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSendChatMessage([]));

    expect(result.current.isSending).toBe(false);
    expect(result.current.sendError).toBeNull();
    expect(result.current.sendMessageStatus.status).toBe('not loaded');
  });

  it('should send message and update state on success', async () => {
    const { result } = renderHook(() => useSendChatMessage([]));

    const setDraft = jest.fn();
    const setMessages = jest.fn();

    act(() => {
      result.current.sendMessage({
        draft: 'Hello',
        setDraft,
        setMessages,
      });
    });

    // Should set loading state immediately
    await waitFor(() => {
      expect(result.current.isSending).toBe(true);
    });

    // Draft should be cleared
    expect(setDraft).toHaveBeenCalledWith('');

    // User message should be added
    await waitFor(() => {
      expect(setMessages).toHaveBeenCalledWith(expect.any(Function));
    });

    // Wait for response
    await waitFor(() => {
      expect(result.current.isSending).toBe(false);
    });

    // Should have success state
    expect(result.current.sendMessageStatus.status).toBe('loaded');
    expect(result.current.sendError).toBeNull();

    // Assistant message should be added
    await waitFor(() => {
      expect(setMessages).toHaveBeenCalledTimes(2);
    });
  });

  it('should not send message if draft is empty', async () => {
    const { result } = renderHook(() => useSendChatMessage([]));

    const setDraft = jest.fn();
    const setMessages = jest.fn();

    act(() => {
      result.current.sendMessage({
        draft: '   ',
        setDraft,
        setMessages,
      });
    });

    expect(setDraft).not.toHaveBeenCalled();
    expect(setMessages).not.toHaveBeenCalled();
    expect(sendChatMessageSpy).not.toHaveBeenCalled();
  });

  it('should not send message if already sending', async () => {
    sendChatMessageSpy.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ isSuccess: true, data: 'Response' }), 1000);
        }),
    );

    const { result } = renderHook(() => useSendChatMessage([]));

    const setDraft1 = jest.fn();
    const setMessages1 = jest.fn();

    act(() => {
      result.current.sendMessage({
        draft: 'First message',
        setDraft: setDraft1,
        setMessages: setMessages1,
      });
    });

    // Try to send another message while first is still sending
    const setDraft2 = jest.fn();
    const setMessages2 = jest.fn();

    act(() => {
      result.current.sendMessage({
        draft: 'Second message',
        setDraft: setDraft2,
        setMessages: setMessages2,
      });
    });

    // Should only have called sendChatMessage once
    expect(sendChatMessageSpy).toHaveBeenCalledTimes(1);
    expect(setDraft2).not.toHaveBeenCalled();
    expect(setMessages2).not.toHaveBeenCalled();
  });

  it('should handle API error', async () => {
    const errorMessage = 'API Error';
    sendChatMessageSpy.mockResolvedValue({
      isSuccess: false,
      error: errorMessage,
    });

    const { result } = renderHook(() => useSendChatMessage([]));

    const setDraft = jest.fn();
    const setMessages = jest.fn();

    act(() => {
      result.current.sendMessage({
        draft: 'Test',
        setDraft,
        setMessages,
      });
    });

    await waitFor(() => {
      expect(result.current.sendMessageStatus.status).toBe('error');
    });

    expect(result.current.sendError).toBe(errorMessage);
  });

  it('should handle network error', async () => {
    sendChatMessageSpy.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useSendChatMessage([]));

    const setDraft = jest.fn();
    const setMessages = jest.fn();

    act(() => {
      result.current.sendMessage({
        draft: 'Test',
        setDraft,
        setMessages,
      });
    });

    await waitFor(() => {
      expect(result.current.sendMessageStatus.status).toBe('error');
    });

    expect(result.current.sendError).toBe('Network error. Please try again.');
  });

  it('should handle empty assistant response with fallback message', async () => {
    sendChatMessageSpy.mockResolvedValue({
      isSuccess: true,
      data: '   ',
    });

    const { result } = renderHook(() => useSendChatMessage([]));

    const setDraft = jest.fn();
    const setMessages = jest.fn();

    act(() => {
      result.current.sendMessage({
        draft: 'Test',
        setDraft,
        setMessages,
      });
    });

    await waitFor(() => {
      expect(result.current.isSending).toBe(false);
    });

    // Check that the fallback message was added
    const lastCall = setMessages.mock.calls[setMessages.mock.calls.length - 1];
    expect(lastCall).toBeDefined();

    // Simulate the updater function to see what message would be added
    const updater = lastCall[0];
    const newMessages = updater([]);
    expect(newMessages[0].content).toBe('Sorry, I could not generate a response.');
  });

  it('should pass message history to API', async () => {
    const messages = [
      { id: '1', role: 'user' as const, content: 'Hello' },
      { id: '2', role: 'assistant' as const, content: 'Hi' },
    ];

    const { result } = renderHook(() => useSendChatMessage(messages));

    const setDraft = jest.fn();
    const setMessages = jest.fn();

    act(() => {
      result.current.sendMessage({
        draft: 'Second question',
        setDraft,
        setMessages,
      });
    });

    await waitFor(() => {
      expect(sendChatMessageSpy).toHaveBeenCalled();
    });

    expect(sendChatMessageSpy).toHaveBeenCalledWith({
      message: 'Second question',
      history: [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi' },
      ],
    });
  });

  it('should create unique IDs for messages', async () => {
    const { result } = renderHook(() => useSendChatMessage([]));

    const setDraft = jest.fn();
    const setMessages = jest.fn();

    act(() => {
      result.current.sendMessage({
        draft: 'First',
        setDraft,
        setMessages,
      });
    });

    await waitFor(() => {
      expect(setMessages).toHaveBeenCalledTimes(2);
    });

    // Get the IDs from the updater functions
    const firstUpdater = setMessages.mock.calls[0][0];
    const firstMessages = firstUpdater([]);

    const secondUpdater = setMessages.mock.calls[1][0];
    const secondMessages = secondUpdater(firstMessages);

    // Both messages should have IDs
    expect(firstMessages[0].id).toBeDefined();
    expect(secondMessages[1].id).toBeDefined();
    // IDs should be different
    expect(firstMessages[0].id).not.toBe(secondMessages[1].id);
  });
});
