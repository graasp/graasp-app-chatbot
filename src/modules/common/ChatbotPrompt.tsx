import { DEFAULT_BOT_USERNAME } from '@/constants';

import { Comment } from './Comment';

type Props = {
  chatbotCue?: string;
  chatbotName?: string;
};

function ChatbotPrompt({
  chatbotCue,
  chatbotName = DEFAULT_BOT_USERNAME,
}: Readonly<Props>): JSX.Element | null {
  if (chatbotCue) {
    return <Comment id="cue" isBot body={chatbotCue} username={chatbotName} />;
  }
  return null;
}

export default ChatbotPrompt;
