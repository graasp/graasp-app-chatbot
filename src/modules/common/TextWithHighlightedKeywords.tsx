import { useTranslation } from 'react-i18next';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, IconButton, Tooltip, Typography, styled } from '@mui/material';

import { stringToColor } from '@graasp/ui/apps';

import { createRegexFromString } from '../analytics/utils';

const StyledBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  wordWrap: 'break-word',
  overflow: 'hidden',
  '&:hover': {
    outline: 'solid var(--graasp-primary) 1px ',
  },
}));

interface Props {
  sentence: string;
  words: string[];
  onClick: () => void;
  memberName: string;
  buttonId: string;
}
const TextWithHighlightedKeywords = ({
  sentence,
  words,
  onClick,
  memberName,
  buttonId,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const parts = sentence.split(/\s+/);
  const content = parts.map((part) => {
    const isMatch =
      part.trim() &&
      words.some(
        (word) =>
          word.trim() &&
          new RegExp(createRegexFromString(word)).test(part.trim()),
      );

    return isMatch ? (
      <span
        key={part + memberName}
        style={{
          color: stringToColor(part),
          backgroundColor: `${stringToColor(part)}20`,
          padding: '4px',
        }}
      >
        {part}
      </span>
    ) : (
      `${part} `
    );
  });

  return (
    <StyledBox>
      <Box sx={{ wordWrap: 'break-word', overflow: 'hidden' }}>
        <Typography variant="caption" display="block">
          {memberName}
        </Typography>
        {content}
      </Box>
      <Tooltip title={t('CHECK_WHOLE_CHAT')}>
        <IconButton onClick={onClick} id={buttonId}>
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </StyledBox>
  );
};

export default TextWithHighlightedKeywords;
