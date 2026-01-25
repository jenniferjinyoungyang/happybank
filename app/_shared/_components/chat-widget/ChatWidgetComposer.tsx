import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { FormEvent } from 'react';
import { Button } from '../Button';

type ChatWidgetComposerProps = {
  readonly draft: string;
  readonly setDraft: (value: string) => void;
  readonly isSending: boolean;
  readonly canSend: boolean;
  readonly onSend: () => void;
  readonly onSubmit: (e: FormEvent) => void;
};

export const ChatWidgetComposer: React.FC<ChatWidgetComposerProps> = ({
  draft,
  setDraft,
  isSending,
  canSend,
  onSend,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="p-3 border-t border-neutral-200 bg-white">
    <div className="flex items-end gap-2">
      <label className="sr-only" htmlFor="chat-widget-input">
        Message
      </label>
      <textarea
        id="chat-widget-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Type a message…"
        rows={2}
        className="flex-1 resize-none rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={isSending}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        data-testid="chat-widget-input"
      />
      <Button
        type="submit"
        label="Send message"
        ariaLabel="Send message"
        disabled={!canSend}
        cssWrapper="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:hover:bg-indigo-600 p-3"
        dataTestId="chat-widget-send"
      >
        <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
      </Button>
    </div>
    <p className="mt-2 text-xs text-gray-500">
      Press <span className="font-semibold">Enter</span> to send,{' '}
      <span className="font-semibold">Shift</span>+<span className="font-semibold">Enter</span> for
      a new line.
    </p>
  </form>
);
