import type { ReactElement } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';

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
  TABLE_VIEW_TABLE_CYPRESS,
  TABLE_VIEW_USERNAME_CELL_CYPRESS,
  TABLE_VIEW_USER_REVIEW_DIALOG_CYPRESS,
  TABLE_VIEW_VIEW_COMMENTS_CELL_CYPRESS,
  tableRowUserCypress,
} from '@/config/selectors';
import { ANONYMOUS_USER } from '@/constants';
import CustomDialog from '@/modules/common/CustomDialog';
import { getOrphans } from '@/utils/comments';

import { ConversationForUser } from '../comment/ConversationForUser';
import DownloadButtons from '../settings/DownloadButtons';
import OrphanComments from '../settings/OrphanComments';

const DEFAULT_CURRENT_USER = {
  name: ANONYMOUS_USER,
  id: '',
};

function ConversationsView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [openCommentView, setOpenCommentView] = useState(false);
  const [currentUser, setCurrentUser] = useState(DEFAULT_CURRENT_USER);
  const { data: { members } = { members: [] } } = hooks.useAppContext();
  const { data: comments = [] } = hooks.useAppData<CommentData>();

  const renderTableBody = (): ReactElement[] | ReactElement | null => {
    const orphansId = getOrphans(comments).map((c) => c.id);
    const nonOrphanComments = comments?.filter(
      (c) => !orphansId.includes(c.id),
    );
    // nonOrphanComments is undefined or, is an empty list -> there are not resources to display
    if (
      !nonOrphanComments ||
      nonOrphanComments.length === 0 // oxlint-disable-line eslint/yoda
    ) {
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
    const commentsByUsers = Object.entries(
      groupBy(nonOrphanComments, ({ account }) => account.id),
    );
    return commentsByUsers.map(([userId, userComments]) => {
      const userName =
        members.find(({ id }) => id === userId)?.name || ANONYMOUS_USER;
      return (
        <TableRow key={userId} data-cy={tableRowUserCypress(userId)}>
          <TableCell data-cy={TABLE_VIEW_USERNAME_CELL_CYPRESS}>
            {userName}
          </TableCell>
          <TableCell data-cy={TABLE_VIEW_NB_COMMENTS_CELL_CYPRESS}>
            <div>{userComments.length}</div>
          </TableCell>
          <TableCell data-cy={TABLE_VIEW_VIEW_COMMENTS_CELL_CYPRESS}>
            <IconButton
              data-cy={TABLE_VIEW_OPEN_REVIEW_BUTTON_CYPRESS}
              onClick={() => {
                setCurrentUser({
                  name: userName,
                  id: userId,
                });
                setOpenCommentView(true);
              }}
            >
              <MessagesSquare color={theme.palette.primary.main} />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  };

  const onCloseDialog = (): void => {
    setCurrentUser(DEFAULT_CURRENT_USER);
    setOpenCommentView(false);
  };

  return (
    <Stack spacing={2}>
      <DownloadButtons />
      <OrphanComments comments={comments} />
      <TableContainer data-cy={TABLE_VIEW_TABLE_CYPRESS}>
        <Table aria-label="student table">
          <TableHead>
            <TableRow>
              <TableCell>{t('NAME_COLUMN_HEADER')}</TableCell>
              <TableCell>{t('MESSAGE_NUMBER_COLUMN_HEADER')}</TableCell>
              <TableCell>{t('VIEW_CHAT_COLUMN_HEADER')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody data-cy={TABLE_VIEW_BODY_USERS_CYPRESS}>
            {renderTableBody()}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomDialog
        dataCy={TABLE_VIEW_USER_REVIEW_DIALOG_CYPRESS}
        open={openCommentView}
        maxWidth="lg"
        title={t('DISCUSSION_DIALOG_TITLE', { user: currentUser.name })}
        onClose={onCloseDialog}
      >
        {/* // todo: filter app data  */}
        <ConversationForUser userId={currentUser.id} />
        <IconButton
          data-cy={TABLE_VIEW_REVIEW_DIALOG_CLOSE_BUTTON_CYPRESS}
          onClick={onCloseDialog}
          sx={{ position: 'absolute', top: 0, right: 0, m: 1 }}
        >
          <XIcon />
        </IconButton>
      </CustomDialog>
    </Stack>
  );
}

export default ConversationsView;
