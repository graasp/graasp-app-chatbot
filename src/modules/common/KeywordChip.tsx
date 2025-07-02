import { Avatar, Chip } from '@mui/material';

import { stringToColor } from '@graasp/ui/apps';

import { KEYWORD_CHIP_COUNT_ID, buildKeywordChipId } from '@/config/selectors';

function KeywordChip({
  text,
  count,
  isSelected,
  onClick,
}: Readonly<{
  text: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}>) {
  const color = stringToColor(text);
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
}

export default KeywordChip;
