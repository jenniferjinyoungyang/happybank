import { FormEvent } from 'react';
import { ChatMessage } from '../../_types/chat';
import { ChatWidgetComposer } from './ChatWidgetComposer';
import { ChatWidgetHeader } from './ChatWidgetHeader';
import { ChatWidgetMessages } from './ChatWidgetMessages';

type ChatWidgetPanelProps = {
  readonly messages: readonly ChatMessage[];
  readonly isSending: boolean;
  readonly sendError: string | null;
  readonly onClose: () => void;
  readonly draft: string;
  readonly setDraft: (value: string) => void;
  readonly canSend: boolean;
  readonly onSend: () => void;
  readonly onSubmit: (e: FormEvent) => void;
  readonly bottomRef: React.RefObject<HTMLDivElement>;
};

export const ChatWidgetPanel: React.FC<ChatWidgetPanelProps> = ({
  messages,
  isSending,
  sendError,
  onClose,
  draft,
  setDraft,
  canSend,
  onSend,
  onSubmit,
  bottomRef,
}) => (
  <div
    className="w-[22rem] sm:w-[26rem] h-[32rem] rounded-2xl bg-white shadow-xl ring-1 ring-black/10 flex flex-col overflow-hidden"
    data-testid="chat-widget-panel"
  >
    <ChatWidgetHeader onClose={onClose} />

    {sendError ? (
      <div
        className="px-4 py-2 bg-red-50 border-b border-red-200 text-sm text-red-800"
        role="alert"
      >
        {sendError}
      </div>
    ) : null}

    <ChatWidgetMessages messages={messages} isSending={isSending} bottomRef={bottomRef} />

    <ChatWidgetComposer
      draft={draft}
      setDraft={setDraft}
      isSending={isSending}
      canSend={canSend}
      onSend={onSend}
      onSubmit={onSubmit}
    />
  </div>
);
