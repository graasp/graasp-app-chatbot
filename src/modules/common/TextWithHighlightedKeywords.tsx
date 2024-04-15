import React from 'react';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, IconButton, Tooltip, Typography, styled } from '@mui/material';

import stc from 'string-to-color';

import { createRegexFromString } from '../analytics/utils';

const StyledBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '&:hover': {
    outline: 'solid var(--graasp-primary) 1px ',
  },
}));

interface Props {
  sentence: string;
  words: string[];
  onClick: () => void;
  memberName: string;
}
const TextWithHighlightedKeywords = ({
  sentence,
  words,
  onClick,
  memberName,
}: Props): JSX.Element => {
  const parts = sentence.split(/[\s\n]+|\b/);
  const content = parts.map((part, index) => {
    const isMatch = words.some((word) =>
      new RegExp(createRegexFromString(word)).test(part.trim()),
    );

    return isMatch ? (
      <span
        key={index}
        style={{
          color: stc(part),
          backgroundColor: `${stc(part)}20`,
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
      <Box>
        <Typography variant="caption" display="block">
          {memberName}
        </Typography>
        {content}
      </Box>
      <Tooltip title="Check the whole chat">
        <IconButton onClick={onClick}>
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </StyledBox>
  );
};

export default TextWithHighlightedKeywords;
