import { ChangeEventHandler, useRef, useState } from 'react';

import { Badge, IconButton, styled } from '@mui/material';

import { PenIcon } from 'lucide-react';

import { CHATBOT_AVATAR_APP_SETTING_NAME } from '@/config/appSetting';
import { mutations } from '@/config/queryClient';
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

export function ChatbotAvatarEditor() {
  const fileInput = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadThumbnail } = mutations.useUploadAppSettingFile();
  const { mutateAsync: deleteAvatar } = mutations.useDeleteAppSetting();
  const {
    avatar,
    avatarSetting,
    isLoading: isAvatarLoading,
  } = useChatbotAvatar();
  const [isUploading, setIsUploading] = useState(false);

  const onChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target.files) {
      setIsUploading(true);
      try {
        // delete previous avatar
        if (avatarSetting) {
          await deleteAvatar({ id: avatarSetting.id });
        }
        await uploadThumbnail({
          file: e.target.files[0],
          name: CHATBOT_AVATAR_APP_SETTING_NAME,
        });
      } catch (error) {
        console.error(error);
      }
      setIsUploading(false);
    }
  };

  return (
    <Badge
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <EditButton
          disabled={isUploading}
          type="button"
          color="info"
          onClick={() => {
            fileInput?.current?.click();
          }}
        >
          <PenIcon />
          <VisuallyHiddenInput
            ref={fileInput}
            onChange={onChange}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
          />
        </EditButton>
      }
      overlap="circular"
    >
      <ChatbotAvatar
        size="medium"
        avatar={avatar}
        isLoading={isAvatarLoading || isUploading}
      />
    </Badge>
  );
}
