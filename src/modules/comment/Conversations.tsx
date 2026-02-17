import { useTranslation } from 'react-i18next';

import {
  Button,
  Container,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';

import { intlFormat } from 'date-fns';
import groupBy from 'lodash.groupby';
import { MessagesSquareIcon, PlusIcon } from 'lucide-react';
import { v4 } from 'uuid';

import type { CommentData } from '@/config/appData';
import { hooks } from '@/config/queryClient';
import {
  TABLE_VIEW_BODY_USERS_CYPRESS,
  TABLE_VIEW_TABLE_CYPRESS,
} from '@/config/selectors';

import { ChatbotContainer } from './ChatbotContainer';
import ChatbotHeader from './ChatbotHeader';

const useConversations = () => {
  const { i18n } = useTranslation();
  const { data: messages = [] } = hooks.useAppData<CommentData>();

  if (messages) {
    const conversations = groupBy(messages, (c) => c.data.conversationId);
    return Object.entries(conversations)
      .toSorted((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(([id, m]) => {
        const sortedMessages = m.toSorted((a, b) =>
          a.createdAt > b.createdAt ? 1 : -1,
        );
        const creationDate = sortedMessages.at(-1)?.createdAt;

        return {
          id,
          name: sortedMessages[0].data.content,
          messages: m,
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
      });
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

  const startNewConversation = () => {
    onSelect(v4());
  };

  return (
    <Container>
      <ChatbotContainer>
        <Stack gap={3}>
          <ChatbotHeader avatar={chatbotAvatar} name={chatbotName} />
          <TableContainer data-cy={TABLE_VIEW_TABLE_CYPRESS}>
            <Table aria-label="conversations table">
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
                        onClick={() => {
                          console.debug(`Open conversation ${c.id}`);
                          onSelect(c.id);
                        }}
                      >
                        <MessagesSquareIcon />
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
    </Container>
  );
}
