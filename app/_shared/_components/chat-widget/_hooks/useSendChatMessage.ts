'use client';

import { useCallback, useState } from 'react';
import { ChatHistoryMessage, sendChatMessage } from '../../../_api/sendChatMessage';
import { ChatMessage } from '../../../_types/chat';
import {
  ApiData,
  getInitialApiDataStatus,
  isLoadingStatus,
  setLoadingStatus,
} from '../../../_utils/apiData';
import { createId } from './useSendChatMessage.utils';

type SendMessageParams = {
  readonly draft: string;
  readonly setDraft: (value: string) => void;
  readonly setMessages: (updater: (prev: ChatMessage[]) => ChatMessage[]) => void;
};

type UseSendChatMessageResult = {
  readonly sendMessage: (params: SendMessageParams) => void;
  readonly isSending: boolean;
  readonly sendError: string | null;
  readonly sendMessageStatus: ApiData<string>;
};

export const useSendChatMessage = (messages: ChatMessage[]): UseSendChatMessageResult => {
  const [sendMessageStatus, setSendMessageStatus] =
    useState<ApiData<string>>(getInitialApiDataStatus());

  const isSending = isLoadingStatus(sendMessageStatus);
  const sendError = sendMessageStatus.status === 'error' ? sendMessageStatus.error : null;

  const sendMessage = useCallback(
    ({ draft, setDraft, setMessages }: SendMessageParams) => {
      const message = draft.trim();
      if (!message || isSending) return;

      setSendMessageStatus(setLoadingStatus(sendMessageStatus));
      setDraft('');

      const historyForApi: ChatHistoryMessage[] = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const userMessage: ChatMessage = { id: createId(), role: 'user', content: message };
      setMessages((prev) => [...prev, userMessage]);

      sendChatMessage({ message, history: historyForApi })
        .then((result) => {
          if (!result.isSuccess) {
            setSendMessageStatus({
              status: 'error',
              data: null,
              error: result.error,
            });
            return;
          }

          const assistantText = result.data?.trim()
            ? result.data
            : 'Sorry, I could not generate a response.';

          const assistantMessage: ChatMessage = {
            id: createId(),
            role: 'assistant',
            content: assistantText,
          };

          setMessages((prev) => [...prev, assistantMessage]);
          setSendMessageStatus({
            status: 'loaded',
            data: assistantText,
            error: null,
            isLoading: false,
          });
        })
        .catch(() => {
          setSendMessageStatus({
            status: 'error',
            data: null,
            error: 'Network error. Please try again.',
          });
        });
    },
    [isSending, messages, sendMessageStatus],
  );

  return { sendMessage, isSending, sendError, sendMessageStatus };
};
