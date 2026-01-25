import { makeFetchResponseMock } from '../../__mocks__/fetchResponse.mock';
import { ChatHistoryMessage, sendChatMessage } from '../sendChatMessage';

describe('sendChatMessage', () => {
  let fetchSpy: jest.SpyInstance<ReturnType<typeof fetch>>;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  test('returns success with assistant message when API call is successful', async () => {
    const assistantResponse = 'This is a helpful response!';
    fetchSpy.mockResolvedValueOnce(
      makeFetchResponseMock({
        json: jest.fn().mockResolvedValueOnce({ response: assistantResponse }),
      }),
    );

    const result = await sendChatMessage({
      message: 'Hello, how are you?',
      history: [],
    });

    expect(result).toStrictEqual({
      data: assistantResponse,
      isSuccess: true,
    });
  });

  test('sends message and history to API endpoint', async () => {
    fetchSpy.mockResolvedValueOnce(
      makeFetchResponseMock({
        json: jest.fn().mockResolvedValueOnce({ response: 'Response' }),
      }),
    );

    const message = 'What is the weather today?';
    const history: ChatHistoryMessage[] = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ];

    await sendChatMessage({ message, history });

    expect(fetchSpy).toHaveBeenCalledWith('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
      headers: {
        'Content-type': 'application/json',
      },
    });
  });

  test('returns error when API responds with ok=false', async () => {
    const errorMessage = 'Rate limit exceeded';
    fetchSpy.mockResolvedValueOnce(
      makeFetchResponseMock({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ message: errorMessage }),
      }),
    );

    const result = await sendChatMessage({
      message: 'Test message',
      history: [],
    });

    expect(result).toStrictEqual({ isSuccess: false, error: errorMessage });
  });

  test('returns unknown error when fetch throws an error', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('Network error'));

    const result = await sendChatMessage({
      message: 'Test message',
      history: [],
    });

    expect(result).toStrictEqual({ isSuccess: false, error: 'unknown error' });
  });

  test('returns unknown error when response.json() throws an error', async () => {
    fetchSpy.mockResolvedValueOnce(
      makeFetchResponseMock({
        ok: false,
        json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON')),
      }),
    );

    const result = await sendChatMessage({
      message: 'Test message',
      history: [],
    });

    expect(result).toStrictEqual({ isSuccess: false, error: 'unknown error' });
  });

  test('handles message with empty history', async () => {
    fetchSpy.mockResolvedValueOnce(
      makeFetchResponseMock({
        json: jest.fn().mockResolvedValueOnce({ response: 'First response' }),
      }),
    );

    const result = await sendChatMessage({
      message: 'Start conversation',
      history: [],
    });

    expect(result.isSuccess).toBe(true);
    expect(result.data).toBe('First response');
  });

  test('handles message with multiple history items', async () => {
    const history: ChatHistoryMessage[] = [
      { role: 'user', content: 'Message 1' },
      { role: 'assistant', content: 'Response 1' },
      { role: 'user', content: 'Message 2' },
      { role: 'assistant', content: 'Response 2' },
    ];

    fetchSpy.mockResolvedValueOnce(
      makeFetchResponseMock({
        json: jest.fn().mockResolvedValueOnce({ response: 'Response 3' }),
      }),
    );

    const result = await sendChatMessage({
      message: 'Message 3',
      history,
    });

    expect(result.isSuccess).toBe(true);
    expect(fetchSpy).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        body: JSON.stringify({ message: 'Message 3', history }),
      }),
    );
  });
});
