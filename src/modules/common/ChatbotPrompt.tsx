import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CardContent, CardHeader } from '@mui/material';

import {
  ChatbotThreadMessage,
  buildPrompt,
  useLocalContext,
} from '@graasp/apps-query-client';
import { UUID } from '@graasp/sdk';

import { AppActionsType } from '@/config/appActions';
import { AppDataTypes, CommentData } from '@/config/appData';
import { ChatbotPromptSettings, SettingsKeys } from '@/config/appSetting';
import { hooks, mutations } from '@/config/queryClient';
import {
  buildChatbotPromptContainerDataCy,
  buildCommentResponseBoxDataCy,
} from '@/config/selectors';
import { DEFAULT_BOT_USERNAME } from '@/constants';

import CommentContainer from '../comment/CommentContainer';
import CustomCommentCard from '../comment/CustomCommentCard';
import ChatbotAvatar from './ChatbotAvatar';
import CommentBody from './CommentBody';
import CommentEditor from './CommentEditor';
import ResponseBox from './ResponseBox';

type Props = {
  id?: UUID;
};

const ChatbotPrompt = ({ id }: Props): JSX.Element | null => {
  const { t } = useTranslation();
  const { mutateAsync: postAppDataAsync } = mutations.usePostAppData();
  const { mutateAsync: postChatBot } = mutations.usePostChatBot();
  const { data: appData } = hooks.useAppData<CommentData>();
  const { data: chatbotPrompts } = hooks.useAppSettings<ChatbotPromptSettings>({
    name: SettingsKeys.ChatbotPrompt,
  });
  const chatbotPrompt = chatbotPrompts?.[0];
  let { memberId } = useLocalContext();
  if (id) {
    memberId = id;
  }
  const [openEditor, setOpenEditor] = useState(false);
  const { mutate: postAction } = mutations.usePostAppAction();

  const comments = appData?.filter((c) => c.creator?.id === memberId);

  const realChatbotPromptExists = comments?.find(
    (c) => c.data.chatbotPromptSettingId !== undefined,
  );

  const handleNewDiscussion = (newUserComment: string): void => {
    if (!chatbotPrompt) {
      throw new Error(
        "unexpected error, chatbot setting is not present, can't sent to API without it",
      );
    }
    const chatbotMessage = chatbotPrompt.data.chatbotCue;
    const newData: CommentData = {
      parent: null,
      content: chatbotMessage,
      chatbotPromptSettingId: chatbotPrompt?.id,
    };
    // post chatbot comment as app data with async call
    postAppDataAsync({
      data: newData,
      type: AppDataTypes.BotComment,
    })?.then((botComment) => {
      const userData = {
        parent: botComment.id,
        content: newUserComment,
      };
      // post new user comment as appData with normal call
      postAppDataAsync({
        data: userData,
        type: AppDataTypes.UserComment,
      })?.then((userMessage) => {
        const threadMessages: ChatbotThreadMessage[] = [
          {
            botDataType: AppDataTypes.BotComment,
            msgType: AppDataTypes.BotComment,
            data: chatbotMessage,
          },
        ];

        const prompt = buildPrompt(
          chatbotPrompt.data.chatbotCue,
          threadMessages,
          newUserComment,
        );

        postAction({
          data: { prompt },
          type: AppActionsType.AskChatbot,
        });

        const actionData = {
          parent: userMessage?.id,
          content: 'error',
        };

        postChatBot(prompt)
          .then((chatBotRes) => {
            actionData.content = chatBotRes.completion;
          })
          .finally(() => {
            // post comment from bot
            postAppDataAsync({
              data: actionData,
              type: AppDataTypes.BotComment,
            });
            postAction({
              data: actionData,
              type: AppActionsType.Create,
            });
          });
      });
    });
    postAction({ data: newData, type: AppActionsType.Create });

    // close editor
    setOpenEditor(false);
  };

  // display only if real chatbot prompt does not exist yet
  if (!realChatbotPromptExists && chatbotPrompt) {
    if (chatbotPrompt?.data?.chatbotCue === '') {
      return <>Please configure the chatbot prompt.</>;
    }
    return (
      <CommentContainer>
        <CustomCommentCard
          elevation={0}
          data-cy={buildChatbotPromptContainerDataCy(chatbotPrompt.id)}
        >
          <CardHeader
            title={DEFAULT_BOT_USERNAME}
            subheader={t('just now')}
            avatar={<ChatbotAvatar />}
          />
          <CardContent sx={{ p: 2, py: 0, '&:last-child': { pb: 0 } }}>
            <CommentBody>{chatbotPrompt?.data?.chatbotCue}</CommentBody>
          </CardContent>
        </CustomCommentCard>

        {openEditor ? (
          <CommentEditor
            maxTextLength={
              300
              // todo: enable general settings
              // generalSettings[GeneralSettingsKeys.MaxCommentLength]
            }
            onCancel={() => setOpenEditor(false)}
            onSend={handleNewDiscussion}
          />
        ) : (
          <ResponseBox
            dataCy={buildCommentResponseBoxDataCy(chatbotPrompt?.id)}
            onClick={() => setOpenEditor(true)}
            commentId={chatbotPrompt?.id}
          />
        )}
      </CommentContainer>
    );
  }
  return null;
};
export default ChatbotPrompt;
