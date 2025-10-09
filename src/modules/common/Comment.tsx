import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { CardProps } from '@mui/material';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  styled,
} from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { formatDate } from '@graasp/sdk';

import { MoreVertical } from 'lucide-react';

import type { CommentAppData } from '@/config/appData';
import { AppDataTypes } from '@/config/appData';
import type { ChatbotPromptSettings } from '@/config/appSetting';
import { ChatbotPromptSettingsKeys, SettingsKeys } from '@/config/appSetting';
import { hooks } from '@/config/queryClient';
import { buildCommentContainerDataCy } from '@/config/selectors';
import { BIG_BORDER_RADIUS, DEFAULT_BOT_USERNAME } from '@/constants';

import ChatbotAvatar from './ChatbotAvatar';
import CommentActions from './CommentActions';
import CommentBody from './CommentBody';
import CustomAvatar from './CustomAvatar';

const CustomCard = styled(Card)<CardProps>({
  borderRadius: BIG_BORDER_RADIUS,
});

type Props = {
  comment: CommentAppData;
  onEdit: (id: string) => void;
};

function Comment({ comment, onEdit }: Props): JSX.Element {
  const { t, i18n } = useTranslation();

  const { accountId } = useLocalContext();
  const { data: appContext } = hooks.useAppContext();
  const currentMember = appContext?.members.find((m) => m.id === accountId);
  const { data: chatbotPrompts } = hooks.useAppSettings<ChatbotPromptSettings>({
    name: SettingsKeys.ChatbotPrompt,
  });
  const chatbotPrompt = chatbotPrompts?.[0];
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [openActionsMenu, setOpenActionsMenu] = useState(false);
  const commentRef = useRef<HTMLDivElement>(null);

  const isBot = comment.type === AppDataTypes.BotComment;

  const isEditable = (): boolean =>
    !!comment.creator && !!accountId && comment.creator.id === accountId;
  const isDeletable = (): boolean => isEditable();

  return (
    <CustomCard
      data-cy={buildCommentContainerDataCy(comment.id)}
      elevation={0}
      ref={commentRef}
    >
      <CardHeader
        title={
          isBot
            ? (chatbotPrompt?.data[ChatbotPromptSettingsKeys.ChatbotName] ??
              DEFAULT_BOT_USERNAME)
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
                <MoreVertical />
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
          </>
        }
      />
      <CardContent sx={{ p: 2, py: 0, '&:last-child': { pb: 0 } }}>
        <CommentBody>{comment.data.content}</CommentBody>
      </CardContent>
    </CustomCard>
  );
}

export default Comment;
