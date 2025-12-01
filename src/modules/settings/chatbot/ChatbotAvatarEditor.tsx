import { ChangeEventHandler, useRef, useState } from 'react';

import { Badge, IconButton, styled } from '@mui/material';

import { PenIcon } from 'lucide-react';

import ChatbotAvatar from '@/modules/common/ChatbotAvatar';
import { useChatbotAvatar } from '@/modules/common/useChatbotAvatar';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const EditButton = styled(IconButton)(() => ({
  height: 30,
  width: 30,
  background: 'lightblue',
  '&:hover': {
    background: '#7EB9CB',
  },
}));

export function ChatbotAvatarEditor({
  onChange,
}: Readonly<{ onChange: (avatar: Blob) => void }>) {
  const fileInput = useRef<HTMLInputElement>(null);

  // currently saved avatar
  const { avatar, isLoading: isAvatarLoading } = useChatbotAvatar();

  // local avatar to display
  const [newAvatar, setNewAvatar] = useState<Blob>();

  const onSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      onChange(file);
      setNewAvatar(file);
    }
  };

  return (
    <Badge
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <EditButton
          type="button"
          color="info"
          onClick={() => {
            fileInput?.current?.click();
          }}
        >
          <PenIcon />
          <VisuallyHiddenInput
            ref={fileInput}
            onChange={onSelect}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
          />
        </EditButton>
      }
      overlap="circular"
    >
      <ChatbotAvatar
        size="medium"
        avatar={newAvatar || avatar}
        isLoading={isAvatarLoading}
      />
    </Badge>
  );
}
