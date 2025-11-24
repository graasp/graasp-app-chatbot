import { Avatar } from '@mui/material';

import { stringToColor } from '@graasp/ui/apps';

import { ANONYMOUS_USER } from '@/constants';

type Props = {
  username?: string;
  imgSrc?: string;
};

function CustomAvatar({
  username = ANONYMOUS_USER,
  imgSrc,
}: Readonly<Props>): JSX.Element {
  return (
    <Avatar
      alt={username}
      src={imgSrc}
      sx={{
        bgcolor: stringToColor(username),
        color: 'white',
        textTransform: 'uppercase',
      }}
    >
      {username[0]}
    </Avatar>
  );
}

export default CustomAvatar;
