import { type JSX, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
} from '@mui/material';

import { ChatBotMessage, ChatbotRole, ChatbotRoleType } from '@graasp/sdk';

type ChatbotConfiguratorProps = {
  value: ChatBotMessage[];
  onChange: (messages: ChatBotMessage[]) => void;
};

const roleOptions = [
  { value: ChatbotRole.System, label: 'System' },
  { value: ChatbotRole.Assistant, label: 'Assistant' },
  { value: ChatbotRole.User, label: 'User' },
];

export function ChatbotConfigurator({
  value,
  onChange,
}: ChatbotConfiguratorProps): JSX.Element {
  const [messages, setMessages] = useState<ChatBotMessage[]>(value);

  const handleRoleChange = (idx: number, role: ChatbotRoleType): void => {
    const updated = messages.map((msg, i) =>
      i === idx ? { ...msg, role } : msg,
    );
    setMessages(updated);
    onChange(updated);
  };

  const handleContentChange = (idx: number, content: string): void => {
    const updated = messages.map((msg, i) =>
      i === idx ? { ...msg, content } : msg,
    );
    setMessages(updated);
    onChange(updated);
  };

  const handleAdd = (): void => {
    const updated = [
      ...messages,
      { role: ChatbotRole.User, content: '' } as ChatBotMessage,
    ];
    setMessages(updated);
    onChange(updated);
  };

  const handleDelete = (idx: number): void => {
    const updated = messages.filter((_, i) => i !== idx);
    setMessages(updated);
    onChange(updated);
  };

  return (
    <Stack spacing={2}>
      {messages.map((msg, idx) => (
        <Paper
          key={idx}
          variant="outlined"
          sx={{ p: 2, display: 'flex', alignItems: 'center' }}
        >
          <Select
            value={msg.role}
            onChange={(e) =>
              handleRoleChange(idx, e.target.value as ChatbotRoleType)
            }
            sx={{ minWidth: 120, mr: 2 }}
            size="small"
          >
            {roleOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          <TextField
            value={msg.content}
            onChange={(e) => handleContentChange(idx, e.target.value)}
            label="Message"
            variant="outlined"
            size="small"
            fullWidth
            multiline
            sx={{ mr: 2 }}
          />
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(idx)}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Paper>
      ))}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        sx={{ alignSelf: 'flex-start' }}
      >
        Add Example
      </Button>
    </Stack>
  );
}
