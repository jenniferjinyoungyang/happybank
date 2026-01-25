import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../Button';

type ChatWidgetHeaderProps = {
  readonly onClose: () => void;
};

export const ChatWidgetHeader: React.FC<ChatWidgetHeaderProps> = ({ onClose }) => (
  <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-white">
    <div className="flex items-center gap-2">
      <ChatBubbleLeftRightIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
      <p className="font-semibold text-gray-900">HappyBank Chat</p>
    </div>
    <Button
      type="button"
      label="Close chat"
      ariaLabel="Close chat"
      onClick={onClose}
      cssWrapper="bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-600 p-2 py-0 rounded-md"
      dataTestId="chat-widget-close"
    >
      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
    </Button>
  </div>
);
