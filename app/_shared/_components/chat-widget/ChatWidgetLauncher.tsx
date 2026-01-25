import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Button } from '../Button';

type ChatWidgetLauncherProps = {
  readonly onOpen: () => void;
};

export const ChatWidgetLauncher: React.FC<ChatWidgetLauncherProps> = ({ onOpen }) => (
  <Button
    type="button"
    label="Open chat"
    ariaLabel="Open chat"
    onClick={onOpen}
    cssWrapper="rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-4"
    dataTestId="chat-widget-launcher"
  >
    <ChatBubbleLeftRightIcon className="h-6 w-6" aria-hidden="true" />
  </Button>
);
