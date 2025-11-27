import { CHATBOT_AVATAR_APP_SETTING_NAME } from '@/config/appSetting';
import { hooks } from '@/config/queryClient';

export const useChatbotAvatar = () => {
  const { data: appSettings } = hooks.useAppSettings({
    name: CHATBOT_AVATAR_APP_SETTING_NAME,
  });
  // get latest thumbnail
  const avatarSetting = appSettings?.toSorted((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  )?.[0];

  const { data: avatar } = hooks.useAppSettingFile(
    {
      appSettingId: avatarSetting?.id ?? 'invalid',
    },
    { enabled: Boolean(avatarSetting?.id) },
  );

  return { avatar, avatarSetting };
};
