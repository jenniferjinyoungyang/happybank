import { ApiResult } from '../_types/apiResult';

export type ChatHistoryMessage = {
  readonly role: 'user' | 'assistant';
  readonly content: string;
};

export const sendChatMessage = async ({
  message,
  history,
}: {
  readonly message: string;
  readonly history: ChatHistoryMessage[];
}): Promise<ApiResult<string>> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!response.ok) {
      const { message: errorMessage } = (await response.json()) as { message: string };
      return {
        isSuccess: false,
        error: errorMessage,
      };
    }

    const { response: assistantMessage } = (await response.json()) as { response: string };
    return { isSuccess: true, data: assistantMessage };
  } catch (err) {
    return { isSuccess: false, error: 'unknown error' };
  }
};
