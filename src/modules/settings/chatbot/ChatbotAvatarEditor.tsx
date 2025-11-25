import { ChangeEventHandler, useRef } from 'react';

import { Avatar, Badge, IconButton, styled } from '@mui/material';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { PenIcon } from 'lucide-react';

import { CHATBOT_THUMBNAIL_APP_SETTING_NAME } from '@/config/appSetting';
import { API_HOST } from '@/config/env';
import { API_ROUTES, hooks } from '@/config/queryClient';

const { buildUploadAppSettingFilesRoute } = API_ROUTES;

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

const getItemId = () => {
  const sp = new URL(location.href).searchParams;
  return sp.get('itemId') ?? 'invalid';
};

export const useUploadThumbnail = () => {
  const itemId = getItemId();
  const { data: token } = hooks.useAuthToken(itemId);
  return useMutation({
    mutationFn: async (args: { file: Blob }) => {
      const payload = new FormData();

      /* WARNING: this file field needs to be the last one,
       * otherwise the normal fields can not be read
       * https://github.com/fastify/fastify-multipart?tab=readme-ov-file#usage
       */
      payload.append('name', CHATBOT_THUMBNAIL_APP_SETTING_NAME);
      payload.append('files', args.file);

      await axios.post(
        `${API_HOST}/${buildUploadAppSettingFilesRoute(itemId)}`,
        payload,
        {
          //   formData: true,
          //   allowedMetaFields: ['name'],
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      console.debug('success');
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });
};

export function ChatbotAvatarEditor() {
  const fileInput = useRef<HTMLInputElement>(null);
  const { mutate: uploadThumbnail } = useUploadThumbnail();
  const { data: appSettings } = hooks.useAppSettings({
    name: CHATBOT_THUMBNAIL_APP_SETTING_NAME,
  });
  const thumbnailAppSetting = appSettings?.[0];
  const { data: thumbnail } = hooks.useAppSettingFile(
    {
      appSettingId: thumbnailAppSetting?.id ?? 'invalid',
    },
    { enabled: Boolean(thumbnailAppSetting?.id) },
  );

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      uploadThumbnail({ file: e.target.files[0] });
    }
  };

  // eslint-disable-next-line no-console
  console.log(thumbnail);

  return (
    <Badge
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <EditButton
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
      <Avatar
        sx={{
          backgroundColor: 'var(--graasp-primary)',
          width: 56,
          height: 56,
        }}
        src={thumbnail ? URL.createObjectURL(thumbnail) : 'undefined'}
      >
        {/* <BotIcon size={40} color="#fff" /> */}
      </Avatar>
    </Badge>
  );
}
