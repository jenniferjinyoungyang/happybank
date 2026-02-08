import { ChatMessage } from '../../_types/chat';

type ChatWidgetMessagesProps = {
  readonly messages: readonly ChatMessage[];
  readonly isSending: boolean;
  readonly bottomRef: React.RefObject<HTMLDivElement | null>;
};

export const ChatWidgetMessages: React.FC<ChatWidgetMessagesProps> = ({
  messages,
  isSending,
  bottomRef,
}) => (
  <div
    className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-neutral-50"
    data-testid="chat-widget-messages"
  >
    {messages.length === 0 ? (
      <div className="text-sm text-gray-600">
        Ask me anything—happy memory ideas, journaling prompts, or just chat.
      </div>
    ) : null}

    {messages.map((m) => (
      <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div
          className={[
            'max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words',
            m.role === 'user'
              ? 'bg-indigo-600 text-white rounded-br-md'
              : 'bg-white text-gray-900 ring-1 ring-black/5 rounded-bl-md',
          ].join(' ')}
        >
          {m.content}
        </div>
      </div>
    ))}

    {isSending ? (
      <div className="flex justify-start">
        <div className="bg-white text-gray-900 ring-1 ring-black/5 rounded-2xl rounded-bl-md px-3 py-2 text-sm">
          <span className="inline-flex items-center gap-2">
            <span
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600"
              aria-hidden="true"
            />
            Thinking…
          </span>
        </div>
      </div>
    ) : null}

    <div ref={bottomRef} />
  </div>
);
