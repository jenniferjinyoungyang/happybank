'use client';

import { useSession } from 'next-auth/react';
import { FC, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChatMessage } from '../_types/chat';
import { useSendChatMessage } from './chat-widget/_hooks/useSendChatMessage';
import { ChatWidgetLauncher } from './chat-widget/ChatWidgetLauncher';
import { ChatWidgetPanel } from './chat-widget/ChatWidgetPanel';

const ChatWidget: FC = () => {
  const { status } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { sendMessage, isSending, sendError } = useSendChatMessage(messages);

  const canSend = useMemo(() => !isSending && draft.trim().length > 0, [draft, isSending]);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    scrollToBottom();
  }, [isOpen, messages.length, scrollToBottom]);

  const handleSendMessage = useCallback(() => {
    sendMessage({ draft, setDraft, setMessages });
  }, [draft, sendMessage]);

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      handleSendMessage();
    },
    [handleSendMessage],
  );

  // API requires auth; hide widget until session is authenticated.
  if (status !== 'authenticated') return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <ChatWidgetPanel
          messages={messages}
          isSending={isSending}
          sendError={sendError}
          onClose={() => setIsOpen(false)}
          draft={draft}
          setDraft={setDraft}
          canSend={canSend}
          onSend={handleSendMessage}
          onSubmit={onSubmit}
          bottomRef={bottomRef}
        />
      ) : (
        <ChatWidgetLauncher onOpen={() => setIsOpen(true)} />
      )}
    </div>
  );
};

export default ChatWidget;
