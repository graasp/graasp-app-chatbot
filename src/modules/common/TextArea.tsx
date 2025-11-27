import TextareaAutosize from '@mui/material/TextareaAutosize';
import { styled } from '@mui/material/styles';

import { SMALL_BORDER_RADIUS } from '@/constants';

export const TextArea = styled(TextareaAutosize)(({ theme }) => ({
  borderRadius: SMALL_BORDER_RADIUS,
  padding: theme.spacing(2),
  fontSize: '1rem',
  boxSizing: 'border-box',
  resize: 'vertical',
  border: 0,
  outline: 'solid rgba(80, 80, 210, 0.5) 1px',
  // make sure the outline is offset by the same amount that it is wide to not overflow
  outlineOffset: '-1px',
  width: '100%',
  minWidth: '0',
  minHeight: `calc(1rem + 2*${theme.spacing(2)})`,
  transition: 'outline 250ms ease-in-out',
  '&:focus': {
    outline: 'solid var(--graasp-primary) 2px !important',
  },
  '&:hover': {
    outline: 'solid var(--graasp-primary) 1px ',
  },
  fontFamily: 'unset',
  lineHeight: 'unset',
}));
