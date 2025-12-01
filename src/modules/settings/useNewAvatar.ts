import { useCallback } from 'react';

import { CHATBOT_AVATAR_APP_SETTING_NAME } from '@/config/appSetting';
import { mutations } from '@/config/queryClient';

import { useChatbotAvatar } from '../common/useChatbotAvatar';

export const useSaveAvatar = () => {
  const { mutateAsync: uploadThumbnail } = mutations.useUploadAppSettingFile();
  const { mutateAsync: deleteAvatar } = mutations.useDeleteAppSetting();
  const { avatarSetting } = useChatbotAvatar();

  const uploadNewAvatar = useCallback(
    async (newAvatar: Blob) => {
      try {
        await uploadThumbnail({
          file: newAvatar,
          name: CHATBOT_AVATAR_APP_SETTING_NAME,
        });
        // delete previous avatar
        if (avatarSetting) {
          await deleteAvatar({ id: avatarSetting.id });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [avatarSetting, deleteAvatar, uploadThumbnail],
  );

  return uploadNewAvatar;
};
