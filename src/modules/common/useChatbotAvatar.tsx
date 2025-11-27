import { CHATBOT_AVATAR_APP_SETTING_NAME } from '@/config/appSetting';
import { hooks } from '@/config/queryClient';

export const useChatbotAvatar = () => {
  const { data: appSettings, isLoading: isAppSettingsLoading } =
    hooks.useAppSettings({
      name: CHATBOT_AVATAR_APP_SETTING_NAME,
    });
  // get latest thumbnail
  const avatarSetting = appSettings?.toSorted((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  )?.[0];

  const hasAvatar = Boolean(avatarSetting?.id);

  const { data: avatar, isLoading: isFileLoading } = hooks.useAppSettingFile(
    {
      appSettingId: avatarSetting?.id ?? 'invalid',
    },
    { enabled: hasAvatar },
  );

  return {
    avatar,
    avatarSetting,
    isLoading: isAppSettingsLoading || (hasAvatar && isFileLoading),
  };
};
