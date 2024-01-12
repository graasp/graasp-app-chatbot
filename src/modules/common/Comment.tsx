import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MoreVert } from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardHeader,
  CardProps,
  IconButton,
  Tooltip,
  styled,
} from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { formatDate } from '@graasp/sdk';

import { AppDataTypes, CommentAppData } from '@/config/appData';
import {
  ChatbotPromptSettings,
  ChatbotPromptSettingsKeys,
  SettingsKeys,
} from '@/config/appSetting';
import { hooks } from '@/config/queryClient';
import { buildCommentContainerDataCy } from '@/config/selectors';
import { BIG_BORDER_RADIUS, DEFAULT_BOT_USERNAME } from '@/constants';

import ChatbotAvatar from './ChatbotAvatar';
import CommentActions from './CommentActions';
import CommentBody from './CommentBody';
// import { useMembersContext } from '../context/MembersContext';
import CustomAvatar from './CustomAvatar';

const CustomCard = styled(Card)<CardProps>({
  borderRadius: BIG_BORDER_RADIUS,
});

type Props = {
  comment: CommentAppData;
  onEdit: (id: string) => void;
};

const Comment = ({ comment, onEdit }: Props): JSX.Element => {
  const { t, i18n } = useTranslation();
  // const members = useMembersContext();
  // const {
  //   // [GENERAL_SETTINGS_NAME]: settings = DEFAULT_GENERAL_SETTINGS,
  // } = useSettings();
  const currentMemberId = useLocalContext().memberId;
  const { data: appContext } = hooks.useAppContext();
  const currentMember = appContext?.members.find(
    (m) => m.id === currentMemberId,
  );
  const { data: chatbotPrompts } = hooks.useAppSettings<ChatbotPromptSettings>({
    name: SettingsKeys.ChatbotPrompt,
  });
  const chatbotPrompt = chatbotPrompts?.[0];
  // const { mutate: postAppData } = mutations.usePostAppData();

  // const allowCommentReporting = true; // settings[GeneralSettingsKeys.AllowCommentsReporting];
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [openActionsMenu, setOpenActionsMenu] = useState(false);
  // const [openFlagDialog, setOpenFlagDialog] = useState(false);
  const commentRef = useRef<HTMLDivElement>(null);

  // currently not using members
  // const member = members.find((u) => u.id === comment.memberId);
  // const userName = member?.name || ANONYMOUS_USER;

  const isBot = comment.type === AppDataTypes.BotComment;

  const isEditable = (): boolean =>
    !!comment.creator &&
    !!currentMemberId &&
    comment.creator.id === currentMemberId;
  const isDeletable = (): boolean => isEditable();

  // const sendCommentReport = (reason: string): void => {
  //   postAppData({
  //     data: { reason, commentId: comment.id },
  //     type: AppDataTypes.FLAG,
  //   });
  // };

  return (
    <CustomCard
      data-cy={buildCommentContainerDataCy(comment.id)}
      elevation={0}
      ref={commentRef}
    >
      <CardHeader
        title={
          isBot
            ? chatbotPrompt?.data[ChatbotPromptSettingsKeys.ChatbotName] ||
              DEFAULT_BOT_USERNAME
            : currentMember?.name
        }
        subheader={formatDate(comment.updatedAt, { locale: i18n.language })}
        avatar={
          isBot ? <ChatbotAvatar /> : <CustomAvatar member={currentMember} />
        }
        action={
          <>
            <Tooltip title={t('COMMENT_ACTIONS_TOOLTIP')}>
              <IconButton
                onClick={(e) => {
                  setMenuAnchorEl(e.currentTarget);
                  setOpenActionsMenu(true);
                }}
              >
                <MoreVert />
              </IconButton>
            </Tooltip>
            <CommentActions
              open={openActionsMenu}
              comment={comment}
              menuAnchorEl={menuAnchorEl}
              showEdit={isEditable()}
              showDelete={isDeletable()}
              // showFlag={allowCommentReporting}
              // onClickFlag={() => setOpenFlagDialog(true)}
              onClose={() => {
                setMenuAnchorEl(null);
                setOpenActionsMenu(false);
              }}
              onEdit={onEdit}
            />
            {/* <ReportCommentDialog
            open={openFlagDialog}
            setOpen={setOpenFlagDialog}
            // onSendReport={sendCommentReport}
            commentRef={commentRef}
          /> */}
          </>
        }
      />
      <CardContent sx={{ p: 2, py: 0, '&:last-child': { pb: 0 } }}>
        <CommentBody>{comment.data.content}</CommentBody>
      </CardContent>
    </CustomCard>
  );
};

export default Comment;
