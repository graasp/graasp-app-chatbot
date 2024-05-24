import React from 'react';

import { Avatar, Chip } from '@mui/material';

import stc from 'string-to-color';

import { KEYWORD_CHIP_COUNT_ID, buildKeywordChipId } from '@/config/selectors';

const KeywordChip = ({
  text,
  count,
  isSelected,
  onClick,
}: {
  text: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}): JSX.Element => {
  const color = stc(text);
  return (
    <Chip
      avatar={
        <Avatar
          id={KEYWORD_CHIP_COUNT_ID}
          sx={{ bgcolor: color, color: 'white !important' }}
        >
          {count}
        </Avatar>
      }
      onClick={onClick}
      label={text}
      id={buildKeywordChipId(text)}
      sx={{
        color,
        borderColor: color,
        bgcolor: isSelected ? 'none' : `${color}10`,
      }}
      variant={isSelected ? 'outlined' : 'filled'}
    />
  );
};

export default KeywordChip;
