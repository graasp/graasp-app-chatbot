import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, CardContent, CardHeader } from '@mui/material';

import type { ChatbotThreadMessage } from '@graasp/apps-query-client';
import { buildPrompt, useLocalContext } from '@graasp/apps-query-client';
import type { GPTVersionType, UUID } from '@graasp/sdk';

import { AppActionsType } from '@/config/appActions';
import type { CommentData } from '@/config/appData';
import { AppDataTypes } from '@/config/appData';
import type {
  ChatbotPromptSettings,
  GeneralSettings,
} from '@/config/appSetting';
import {
  DEFAULT_GENERAL_SETTINGS,
  GeneralSettingsKeys,
  SettingsKeys,
} from '@/config/appSetting';
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

function ChatbotPrompt({ id }: Props): JSX.Element | null {
  const { t } = useTranslation();
  const { mutateAsync: postAppDataAsync } = mutations.usePostAppData();
  const { data: appData } = hooks.useAppData<CommentData>();
  const {
    data: chatbotPrompts,
    isSuccess,
    isError,
  } = hooks.useAppSettings<ChatbotPromptSettings>({
    name: SettingsKeys.ChatbotPrompt,
  });
  const chatbotPrompt = chatbotPrompts?.[0];

  const { mutateAsync: postChatBot } = mutations.usePostChatBot(
    chatbotPrompt?.data?.gptVersion as GPTVersionType,
  );

  const { data: generalSettings } = hooks.useAppSettings<GeneralSettings>({
    name: SettingsKeys.General,
  });
  const generalSetting = generalSettings?.[0]?.data ?? DEFAULT_GENERAL_SETTINGS;
  const { accountId } = useLocalContext();

  const [openEditor, setOpenEditor] = useState(false);
  const { mutate: postAction } = mutations.usePostAppAction();

  const comments = appData?.filter((c) => c.creator?.id === (id ?? accountId));

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
      // oxlint-disable-next-line eslint-plugin-unicorn/no-null
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

        const prompt = [
          // this is to spread the JSON setting before the messages
          ...chatbotPrompt.data.initialPrompt,
          // this function requests the prompt as the first argument in string format
          // we can not use it in this context as we are using a JSON prompt.
          // if we simplify the prompt in the future we will be able to remove the line above
          // and this function solely
          ...buildPrompt(undefined, threadMessages, newUserComment),
        ];

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

  if (!chatbotPrompt) {
    if (isSuccess) {
      return (
        <Alert severity="warning">{t('CHATBOT_CONFIGURATION_MISSING')}</Alert>
      );
    }
    if (isError) {
      return (
        <Alert severity="error">{t('CHATBOT_CONFIGURATION_FETCH_ERROR')}</Alert>
      );
    }
    // do not show anything if it has not finished fetching
    return null; // oxlint-disable-line eslint-plugin-unicorn/no-null
  }
  const chatbotName = chatbotPrompt?.data?.chatbotName || DEFAULT_BOT_USERNAME;

  // display only if real chatbot prompt does not exist yet
  if (!realChatbotPromptExists) {
    if ('' === chatbotPrompt?.data?.chatbotCue) {
      return <>Please configure the chatbot prompt.</>;
    }
    return (
      <CommentContainer>
        <CustomCommentCard
          elevation={0}
          data-cy={buildChatbotPromptContainerDataCy(chatbotPrompt.id)}
        >
          <CardHeader
            title={chatbotName}
            subheader={t('JUST_NOW_COMMENT_HEADER')}
            avatar={<ChatbotAvatar />}
          />
          <CardContent sx={{ p: 2, py: 0, '&:last-child': { pb: 0 } }}>
            <CommentBody>{chatbotPrompt?.data?.chatbotCue}</CommentBody>
          </CardContent>
        </CustomCommentCard>

        {openEditor ? (
          <CommentEditor
            maxTextLength={generalSetting[GeneralSettingsKeys.MaxCommentLength]}
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
}

export default ChatbotPrompt;
