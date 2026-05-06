import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { intlFormat } from 'date-fns';
import groupBy from 'lodash.groupby';
import { MessagesSquareIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { v4 } from 'uuid';

import type { CommentData } from '@/config/appData';
import { hooks } from '@/config/queryClient';
import {
  DELETE_CONVERSATION_BUTTON_CY,
  DELETE_CONVERSATION_CONFIRM_BUTTON_CY,
  DELETE_CONVERSATION_DIALOG_CY,
  TABLE_VIEW_BODY_USERS_CYPRESS,
  TABLE_VIEW_TABLE_CYPRESS,
} from '@/config/selectors';
import { useDeleteConversation } from '@/modules/common/useDeleteConversation';

import { ChatbotContainer } from './ChatbotContainer';
import ChatbotHeader from './ChatbotHeader';

const useConversations = () => {
  const { i18n } = useTranslation();
  const { data: messages = [] } = hooks.useAppData<CommentData>();

  if (messages) {
    const conversations = groupBy(messages, (c) => c.data.conversationId);
    return Object.entries(conversations)
      .map(([id, m]) => {
        const sortedMessages = m.toSorted((a, b) =>
          a.createdAt > b.createdAt ? 1 : -1,
        );
        const creationDate = sortedMessages.at(-1)?.createdAt;

        return {
          id,
          name: sortedMessages[0].data.content,
          messages: m,
          lastMessageCreatedAt: creationDate ?? '',
          lastMessageDate: creationDate
            ? intlFormat(
                creationDate,
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
        };
      })
      .toSorted((a, b) =>
        a.lastMessageCreatedAt < b.lastMessageCreatedAt ? 1 : -1,
      );
  }

  return [];
};

export function Conversations({
  chatbotAvatar,
  chatbotName,
  onSelect,
}: Readonly<{
  chatbotAvatar?: Blob;
  chatbotName: string;
  onSelect: (id: string) => void;
}>) {
  const { t } = useTranslation();
  const conversations = useConversations();
  const { deleteConversation } = useDeleteConversation();
  const [conversationToDelete, setConversationToDelete] = useState<
    string | null
  >(null);

  const startNewConversation = () => {
    onSelect(v4());
  };

  const handleDeleteConfirm = async () => {
    if (conversationToDelete) {
      await deleteConversation(conversationToDelete);
      setConversationToDelete(null);
    }
  };

  return (
    <Container>
      <ChatbotContainer>
        <Stack gap={3}>
          <ChatbotHeader avatar={chatbotAvatar} name={chatbotName} />
          <TableContainer data-cy={TABLE_VIEW_TABLE_CYPRESS}>
            <Table aria-label={t('List of Conversations')}>
              {/* hide headers visually */}
              <TableHead sx={{ position: 'absolute', clip: 'rect(0 0 0 0)' }}>
                <TableCell>{t('Conversation Name')}</TableCell>
                <TableCell>{t('Last Message Date')}</TableCell>
                <TableCell>{t('Actions')}</TableCell>
              </TableHead>
              <TableBody data-cy={TABLE_VIEW_BODY_USERS_CYPRESS}>
                {conversations.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        noWrap
                        maxWidth={200}
                        title={c.name}
                      >
                        {c.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {c.lastMessageDate}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        title={t('Open conversation')}
                        onClick={() => {
                          onSelect(c.id);
                        }}
                      >
                        <MessagesSquareIcon />
                      </IconButton>
                      <IconButton
                        title={t('Delete conversation')}
                        color="error"
                        data-cy={DELETE_CONVERSATION_BUTTON_CY}
                        onClick={() => setConversationToDelete(c.id)}
                      >
                        <Trash2Icon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack alignItems="center">
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={startNewConversation}
            >
              {t('New conversation')}
            </Button>
          </Stack>
        </Stack>
      </ChatbotContainer>
      <Dialog
        open={Boolean(conversationToDelete)}
        onClose={() => setConversationToDelete(null)}
        data-cy={DELETE_CONVERSATION_DIALOG_CY}
      >
        <DialogTitle>{t('Delete conversation')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('DELETE_CONVERSATION_CONFIRM_MESSAGE')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConversationToDelete(null)}>
            {t('CANCEL_LABEL')}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
            data-cy={DELETE_CONVERSATION_CONFIRM_BUTTON_CY}
          >
            {t('DELETE_LABEL')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
