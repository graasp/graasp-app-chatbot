import React from 'react';

import { Avatar, Chip } from '@mui/material';

import stc from 'string-to-color';

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
        <Avatar sx={{ bgcolor: color, color: 'white !important' }}>
          {count}
        </Avatar>
      }
      onClick={onClick}
      label={text}
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
