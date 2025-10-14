import { useTranslation } from 'react-i18next';

import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';

import { Edit2, Trash2 } from 'lucide-react';

import { AppActionsType } from '@/config/appActions';
import type { CommentAppData } from '@/config/appData';
import { mutations } from '@/config/queryClient';

type Props = {
  open: boolean;
  menuAnchorEl: null | HTMLElement;
  onClose: () => void;
  onEdit: (id: string) => void;
  // onClickFlag?: () => void;
  showDelete?: boolean;
  showEdit?: boolean;
  // showFlag?: boolean;
  comment: CommentAppData;
};

function CommentActions({
  open,
  menuAnchorEl,
  onClose,
  onEdit,
  // onClickFlag,
  showDelete = true,
  showEdit = true,
  // showFlag = true,
  comment,
}: Readonly<Props>): JSX.Element {
  const theme = useTheme();
  const { t } = useTranslation();
  const { mutate: deleteAppData } = mutations.useDeleteAppData();
  const { mutate: postAction } = mutations.usePostAppAction();

  return (
    <Menu
      slotProps={{ list: { dense: true } }}
      open={open}
      anchorEl={menuAnchorEl}
      // center the popover
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      onClose={() => onClose()}
    >
      {showEdit && (
        <MenuItem
          onClick={() => {
            onEdit(comment.id);
            postAction({
              data: { comment },
              type: AppActionsType.Edit,
            });
            onClose();
          }}
        >
          <ListItemIcon>
            <Edit2 color={theme.palette.primary.main} />
          </ListItemIcon>
          <ListItemText>{t('EDIT_LABEL')}</ListItemText>
        </MenuItem>
      )}
      {showDelete && (
        <MenuItem
          onClick={() => {
            deleteAppData({ id: comment.id });
            postAction({
              data: { comment },
              type: AppActionsType.Delete,
            });
            onClose();
          }}
        >
          <ListItemIcon>
            <Trash2 color={theme.palette.error.main} />
          </ListItemIcon>
          <ListItemText>{t('DELETE_LABEL')}</ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
}

export default CommentActions;
