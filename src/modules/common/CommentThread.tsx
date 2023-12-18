import { FC, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CircularProgress, Stack, Typography } from '@mui/material';

import { ChatbotThreadMessage, buildPrompt } from '@graasp/apps-query-client';

import { AppActionsType } from '@/config/appActions';
import { AppDataTypes, CommentAppData } from '@/config/appData';
import { ChatbotPromptSettings, SettingsKeys } from '@/config/appSetting';
// import { DEFAULT_GENERAL_SETTINGS } from '@/config/settings';
// import { GENERAL_SETTINGS_NAME } from '@/config/appSettings';
import { hooks, mutations } from '@/config/queryClient';
import { COMMENT_THREAD_CONTAINER_CYPRESS } from '@/config/selectors';
import { buildThread } from '@/utils/comments';

import CommentContainer from '../comment/CommentContainer';
import ResponseContainer from '../comment/ResponseContainer';
import Comment from './Comment';
import CommentEditor from './CommentEditor';
import ResponseBox from './ResponseBox';

type Props = {
  children?: CommentAppData[];
};

const CommentThread: FC<Props> = ({ children }) => {
  const { t } = useTranslation();
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { mutate: patchData } = mutations.usePatchAppData();
  const { mutateAsync: postAppDataAsync } = mutations.usePostAppData();
  const { mutate: postAction } = mutations.usePostAppAction();
  const { mutateAsync: postChatbot, isLoading } = mutations.usePostChatBot();
  const {
    data: chatbotPrompts,
    // [GENERAL_SETTINGS_NAME]: generalSettings = DEFAULT_GENERAL_SETTINGS,
  } = hooks.useAppSettings<ChatbotPromptSettings>({
    name: SettingsKeys.ChatbotPrompt,
  });
  // todo: add general settings
  const chatbotPrompt = chatbotPrompts?.[0];
  const maxThreadLength = 50; // generalSettings[GeneralSettingsKeys.MaxThreadLength];

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
  if (!children || children.length === 0 || !botComment) {
    return null;
  }
  const commentThread = buildThread(botComment, children);

  console.debug(children);
  // utility functions
  const isReplied = (id: string): boolean => replyingId === id;
  const isEdited = (id: string): boolean => editingId === id;

  return (
    <CommentContainer data-cy={COMMENT_THREAD_CONTAINER_CYPRESS}>
      {commentThread.map((c, i, arr) => {
        console.debug(c.id, isEdited(c.id));
        return (
          <Fragment key={c.id}>
            {isEdited(c.id) ? (
              <CommentEditor
                maxTextLength={
                  300
                  // todo: add general settings
                  // generalSettings[GeneralSettingsKeys.MaxCommentLength]
                }
                onCancel={() => {
                  setEditingId(null);
                }}
                onSend={(content) => {
                  patchData({
                    id: c.id,
                    data: {
                      ...c.data,
                      content,
                    },
                  });
                  setEditingId(null);
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
            {i + 1 === arr.length && isLoading && (
              <ResponseContainer>
                <Stack spacing={2} direction="row" justifyContent="center">
                  <Typography color="#666">{t('Loading')}</Typography>
                  <CircularProgress sx={{ color: '#666' }} size="20px" />
                </Stack>
              </ResponseContainer>
            )}
            {
              // if input bar was clicked, a comment editor opens to compose a response
              isReplied(c.id) && (
                <CommentEditor
                  onCancel={() => setReplyingId(null)}
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

                        const prompt = buildPrompt(
                          chatbotPrompt?.data.chatbotCue,
                          chatbotThread,
                          content,
                        );

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
                    setReplyingId(null);
                  }}
                  comment={{ ...c, data: { ...c.data, content: '' } }}
                />
              )
            }
          </Fragment>
        );
      })}
    </CommentContainer>
  );
};

export default CommentThread;
