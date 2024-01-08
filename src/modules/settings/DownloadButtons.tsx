import { useTranslation } from 'react-i18next';

import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';

import { UseQueryResult } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import { DownloadCloud } from 'lucide-react';

import { hooks } from '@/config/queryClient';
import {
  DOWNLOAD_ACTIONS_BUTTON_CY,
  DOWNLOAD_DATA_BUTTON_CY,
} from '@/config/selectors';

const DownloadButtons = (): JSX.Element => {
  const { t } = useTranslation();

  const { refetch: refetchAppActions, isFetching: isFetchingAppActions } =
    hooks.useAppActions({
      enabled: false,
    });
  const { refetch: refetchAppData, isFetching: isFetchingAppData } =
    hooks.useAppData(undefined, { enabled: false });

  const handleClick =
    (refetchFunction: UseQueryResult['refetch'], suffix: string) =>
    (): void => {
      // fetch actions
      refetchFunction().then(({ data }) => {
        const dataBlob = new Blob([JSON.stringify(data)] || [], {
          type: 'text/plain;charset=utf-8',
        });
        const fileName = `${new Date().toISOString()}_${suffix}.json`;
        saveAs(dataBlob, fileName);
      });
    };

  return (
    <Stack direction="row" justifyContent="center" spacing={2}>
      <LoadingButton
        data-cy={DOWNLOAD_ACTIONS_BUTTON_CY}
        onClick={handleClick(refetchAppActions, 'app_actions')}
        loading={isFetchingAppActions}
        startIcon={<DownloadCloud />}
        variant="outlined"
      >
        {isFetchingAppActions ? t('Downloading') : t('Download Actions')}
      </LoadingButton>
      <LoadingButton
        data-cy={DOWNLOAD_DATA_BUTTON_CY}
        onClick={handleClick(refetchAppData, 'app_data')}
        loading={isFetchingAppData}
        startIcon={<DownloadCloud />}
        variant="outlined"
      >
        {isFetchingAppData ? t('Downloading') : t('Download Data')}
      </LoadingButton>
    </Stack>
  );
};
export default DownloadButtons;
