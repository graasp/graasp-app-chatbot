import { useTranslation } from 'react-i18next';

import { Delete, Edit } from '@mui/icons-material';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';

import { AppActionsType } from '@/config/appActions';
import { CommentAppData } from '@/config/appData';
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

const CommentActions = ({
  open,
  menuAnchorEl,
  onClose,
  onEdit,
  // onClickFlag,
  showDelete = true,
  showEdit = true,
  // showFlag = true,
  comment,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { mutate: deleteAppData } = mutations.useDeleteAppData();
  const { mutate: postAction } = mutations.usePostAppAction();
  console.debug(open, showEdit, showDelete);
  return (
    <Menu
      MenuListProps={{ dense: true }}
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
            // todo: add editing signal
            onEdit(comment.id);
            postAction({
              data: { comment },
              type: AppActionsType.Edit,
            });
            onClose();
          }}
        >
          <ListItemIcon>
            <Edit color="primary" />
          </ListItemIcon>
          <ListItemText>{t('Edit')}</ListItemText>
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
            <Delete color="error" />
          </ListItemIcon>
          <ListItemText>{t('Delete')}</ListItemText>
        </MenuItem>
      )}
      {/* {showFlag && (
        <MenuItem
          onClick={() => {
            onClickFlag?.();
            postAction({
              data: { comment: comment.toJS() },
              type: AppActionsType.re,
            });
            onClose();
          }}
        >
          <ListItemIcon>
            <Flag color="warning" />
          </ListItemIcon>
          <ListItemText>{t('Report')}</ListItemText>
        </MenuItem>
      )} */}
    </Menu>
  );
};

export default CommentActions;
