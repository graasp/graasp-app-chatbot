import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { SxProps, Theme } from '@mui/material';
import { CircularProgress, Stack, Typography } from '@mui/material';

import type { ChatbotThreadMessage } from '@graasp/apps-query-client';
import { buildPrompt } from '@graasp/apps-query-client';
import type { GPTVersionType } from '@graasp/sdk';

import { AppActionsType } from '@/config/appActions';
import type { CommentAppData } from '@/config/appData';
import { AppDataTypes } from '@/config/appData';
import type {
  ChatbotPromptSettings,
  GeneralSettings,
} from '@/config/appSetting';
import { DEFAULT_GENERAL_SETTINGS, SettingsKeys } from '@/config/appSetting';
import { hooks, mutations } from '@/config/queryClient';
import { COMMENT_THREAD_CONTAINER_CYPRESS } from '@/config/selectors';
import { buildThread } from '@/utils/comments';

import CommentContainer from '../comment/CommentContainer';
import ResponseContainer from '../comment/ResponseContainer';
import Comment from './Comment';
import CommentEditor from './CommentEditor';
import ResponseBox from './ResponseBox';

function LoadingIndicator({
  isChatbotLoading,
}: Readonly<{
  isChatbotLoading: boolean;
}>) {
  const { t } = useTranslation();
  return (
    <ResponseContainer>
      <Stack spacing={2} direction="row" justifyContent="center">
        <Typography color="#666">
          {isChatbotLoading
            ? t('LOADING_RESPONSE_PLACEHOLDER')
            : t('PROCESSING_RESPONSE_PLACEHOLDER')}
        </Typography>
        <CircularProgress sx={{ color: '#666' }} size="20px" />
      </Stack>
    </ResponseContainer>
  );
}

type Props = {
  children?: CommentAppData[];
  threadSx: SxProps<Theme>;
};

function CommentThread({
  children,
  threadSx,
}: Readonly<Props>): JSX.Element | null {
  const [replyingId, setReplyingId] = useState<string | null>();
  const [editingId, setEditingId] = useState<string | null>();
  const { mutate: patchData } = mutations.usePatchAppData();
  const { mutateAsync: postAppDataAsync } = mutations.usePostAppData();
  const { mutate: postAction } = mutations.usePostAppAction();
  const { data: chatbotPrompts } = hooks.useAppSettings<ChatbotPromptSettings>({
    name: SettingsKeys.ChatbotPrompt,
  });
  const chatbotPrompt = chatbotPrompts?.[0];

  const { mutateAsync: postChatbot, isLoading } = mutations.usePostChatBot(
    chatbotPrompt?.data?.gptVersion as GPTVersionType,
  );

  const { data: generalSettings } = hooks.useAppSettings<GeneralSettings>({
    name: SettingsKeys.General,
  });
  const { maxThreadLength, maxCommentLength } = {
    ...DEFAULT_GENERAL_SETTINGS,
    ...generalSettings?.[0]?.data,
  };

  const allowedChatbotResponse = (
    arr: CommentAppData[],
    idx: number,
    commentType: string,
  ): boolean =>
    (arr.length < maxThreadLength && commentType === AppDataTypes.BotComment) ||
    // when the comment is a user comment it should not be a response to a chatbot comment
    // -> in this case, we want to wait for the chatbot response
    (commentType === AppDataTypes.UserComment &&
      arr[idx - 1]?.type !== AppDataTypes.BotComment);
  const addResponse = (id: string): void => {
    setReplyingId(id);
  };

  const botComment = children?.find(
    (c) => c.data.chatbotPromptSettingId === chatbotPrompt?.id,
  );

  //oxlint-disable-next-line eslint/yoda
  if (!children || children.length === 0 || !botComment) {
    return null;
  }
  const commentThread = buildThread(botComment, children);

  // utility functions
  const isReplied = (id: string): boolean => replyingId === id;
  const isEdited = (id: string): boolean => editingId === id;

  return (
    <CommentContainer data-cy={COMMENT_THREAD_CONTAINER_CYPRESS} sx={threadSx}>
      {commentThread.map((c, i, arr) => (
        <Fragment key={c.id}>
          {isEdited(c.id) ? (
            <CommentEditor
              maxTextLength={maxCommentLength}
              onCancel={() => {
                setEditingId(undefined);
              }}
              onSend={(content) => {
                patchData({
                  id: c.id,
                  data: {
                    ...c.data,
                    content,
                  },
                });
                setEditingId(undefined);
              }}
              comment={c}
            />
          ) : (
            <Comment comment={c} onEdit={(id) => setEditingId(id)} />
          )}
          {
            // show input bar to respond to comment
            i + 1 === arr.length &&
              !isLoading &&
              !isEdited(c.id) &&
              !isReplied(c.id) &&
              allowedChatbotResponse(arr, i, c.type) && (
                <ResponseBox commentId={c.id} onClick={addResponse} />
              )
          }
          {i + 1 === arr.length && c.type === AppDataTypes.UserComment ? (
            <LoadingIndicator isChatbotLoading={isLoading} />
          ) : undefined}
          {
            // if input bar was clicked, a comment editor opens to compose a response
            isReplied(c.id) && (
              <CommentEditor
                onCancel={() => setReplyingId(undefined)}
                onSend={(content) => {
                  const data = {
                    ...c.data,
                    parent: c.id,
                    content,
                  };

                  postAppDataAsync({
                    data,
                    type: AppDataTypes.UserComment,
                  })?.then((parent) => {
                    // when in a chatbot thread, should also post to the api
                    if (commentThread[0]?.type === AppDataTypes.BotComment) {
                      const chatbotThread: ChatbotThreadMessage[] =
                        commentThread.map((botThread) => ({
                          botDataType: AppDataTypes.BotComment,
                          msgType: botThread.type,
                          data: botThread.data.content,
                        }));

                      const prompt = [
                        // this is to spread the JSON setting before the messages
                        ...(chatbotPrompt?.data?.initialPrompt ?? []),
                        // this function requests the prompt as the first argument in string format
                        // we can not use it in this context as we are using a JSON prompt.
                        // if we simplify the prompt in the future we will be able to remove the line above
                        // and this function solely
                        ...buildPrompt(undefined, chatbotThread, content),
                      ];

                      const newData = {
                        ...data,
                        parent: parent?.id,
                        content: 'error',
                      };

                      postChatbot(prompt)
                        .then((chatBotRes) => {
                          newData.content = chatBotRes.completion;
                        })
                        .finally(() => {
                          postAppDataAsync({
                            data: newData,
                            type: AppDataTypes.BotComment,
                          });
                          postAction({
                            data: newData,
                            type: AppActionsType.Create,
                          });
                        });

                      postAction({
                        data: { prompt },
                        type: AppActionsType.AskChatbot,
                      });
                    }
                  });
                  postAction({
                    data,
                    type: AppActionsType.Reply,
                  });
                  setReplyingId(undefined);
                }}
                comment={{ ...c, data: { ...c.data, content: '' } }}
              />
            )
          }
        </Fragment>
      ))}
    </CommentContainer>
  );
}

export default CommentThread;
