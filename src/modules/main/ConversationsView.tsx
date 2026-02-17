import type { ReactNode } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import { AppData } from '@graasp/sdk';

import { intlFormat } from 'date-fns';
import groupBy from 'lodash.groupby';
import { MessagesSquare, XIcon } from 'lucide-react';

import type { CommentData } from '@/config/appData';
import { hooks } from '@/config/queryClient';
import {
  TABLE_NO_COMMENTS_CYPRESS,
  TABLE_VIEW_BODY_USERS_CYPRESS,
  TABLE_VIEW_NB_COMMENTS_CELL_CYPRESS,
  TABLE_VIEW_OPEN_REVIEW_BUTTON_CYPRESS,
  TABLE_VIEW_REVIEW_DIALOG_CLOSE_BUTTON_CYPRESS,
  TABLE_VIEW_USERNAME_CELL_CYPRESS,
  TABLE_VIEW_USER_REVIEW_DIALOG_CYPRESS,
  TABLE_VIEW_VIEW_COMMENTS_CELL_CYPRESS,
  tableRowUserCypress,
} from '@/config/selectors';
import { ANONYMOUS_USER } from '@/constants';
import CustomDialog from '@/modules/common/CustomDialog';

import { ConversationForUser } from '../comment/ConversationForUser';
import DownloadButtons from '../settings/DownloadButtons';
import OrphanComments from '../settings/OrphanComments';

type ConversationsPerUser = {
  account: {
    id: string;
    name: string;
  };
  conversations: {
    id: string;
    lastMessageAt: string;
    messages: AppData<CommentData>[];
  }[];
};

const useConversationsPerUser = (): ConversationsPerUser[] => {
  const { i18n } = useTranslation();
  const { data: comments = [] } = hooks.useAppData<CommentData>();

  const commentsByUsers = Object.entries(
    groupBy(comments, ({ account }) => account?.id),
  );

  const conversationsByUsers = commentsByUsers.map(([accountId, messages]) => ({
    account: {
      id: accountId,
      name: messages[0].account?.name ?? ANONYMOUS_USER,
    },

    conversations: Object.entries(
      groupBy(messages, (m) => m.data.conversationId),
    ).map(([id, convMessages]) => {
      // get last message date
      const sortedMessages = convMessages.toSorted((a, b) =>
        a.createdAt > b.createdAt ? 1 : -1,
      );
      const lastMessageAt = sortedMessages.at(-1)?.createdAt;

      return {
        id,
        lastMessageAt: lastMessageAt
          ? intlFormat(
              lastMessageAt,
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              },
              { locale: i18n.language },
            )
          : '',
        messages: convMessages,
      };
    }),
  }));

  return conversationsByUsers.toSorted((a, b) =>
    a.account.name > b.account.name ? 1 : -1,
  );
};
const ConversationsTable = ({
  viewConversation,
}: {
  viewConversation: (args: {
    account: ConversationsPerUser['account'];
    id: string;
  }) => void;
}): ReactNode[] | ReactNode => {
  const conversationsPerUser = useConversationsPerUser();
  const { t } = useTranslation();

  // nonOrphanComments is undefined or, is an empty list -> there are not resources to display
  if (!conversationsPerUser) {
    // show that there are no comments available
    return (
      <TableRow>
        <TableCell
          data-cy={TABLE_NO_COMMENTS_CYPRESS}
          colSpan={3}
          align="center"
        >
          {t('NO_COMMENTS_PLACEHOLDER')}
        </TableCell>
      </TableRow>
    );
  }

  return conversationsPerUser.map(({ account, conversations }) => {
    return (
      <TableRow key={account.id} data-cy={tableRowUserCypress(account.id)}>
        <TableCell data-cy={TABLE_VIEW_USERNAME_CELL_CYPRESS}>
          {account.name}
        </TableCell>
        <TableCell data-cy={TABLE_VIEW_NB_COMMENTS_CELL_CYPRESS}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('Last message')}</TableCell>
                <TableCell>{t('Number of messages')}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            {conversations.map(({ id, lastMessageAt, messages }) => (
              <TableRow key={id}>
                <TableCell>{lastMessageAt}</TableCell>
                <TableCell>{messages.length}</TableCell>
                <TableCell
                  align="right"
                  data-cy={TABLE_VIEW_VIEW_COMMENTS_CELL_CYPRESS}
                >
                  <IconButton
                    data-cy={TABLE_VIEW_OPEN_REVIEW_BUTTON_CYPRESS}
                    onClick={() => viewConversation({ account, id })}
                    color="primary"
                  >
                    <MessagesSquare />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </TableCell>
      </TableRow>
    );
  });
};

function ConversationsView() {
  const { t } = useTranslation();
  const [openCommentView, setOpenCommentView] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<null | {
    account: ConversationsPerUser['account'];
    conversationId: string;
  }>(null);
  const { data: comments = [] } = hooks.useAppData<CommentData>();

  const viewConversation = ({
    account,
    id,
  }: {
    account: ConversationsPerUser['account'];
    id: string;
  }) => {
    setSelectedConversation({
      account,
      conversationId: id,
    });
    setOpenCommentView(true);
  };

  const onCloseDialog = (): void => {
    setSelectedConversation(null);
    setOpenCommentView(false);
  };

  return (
    <Stack spacing={2}>
      <DownloadButtons />
      <OrphanComments comments={comments} />
      <Table size="small" aria-label="conversations per user table">
        <TableBody data-cy={TABLE_VIEW_BODY_USERS_CYPRESS}>
          <ConversationsTable viewConversation={viewConversation} />
        </TableBody>
      </Table>
      {selectedConversation && (
        <CustomDialog
          dataCy={TABLE_VIEW_USER_REVIEW_DIALOG_CYPRESS}
          open={openCommentView}
          maxWidth="lg"
          title={t('DISCUSSION_DIALOG_TITLE', {
            user: selectedConversation.account.name,
          })}
          onClose={onCloseDialog}
        >
          <ConversationForUser
            accountId={selectedConversation.account.id}
            conversationId={selectedConversation.conversationId}
          />
          <IconButton
            data-cy={TABLE_VIEW_REVIEW_DIALOG_CLOSE_BUTTON_CYPRESS}
            onClick={onCloseDialog}
            sx={{ position: 'absolute', top: 0, right: 0, m: 1 }}
          >
            <XIcon />
          </IconButton>
        </CustomDialog>
      )}
    </Stack>
  );
}

export default ConversationsView;
