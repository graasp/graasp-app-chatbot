import { useTranslation } from 'react-i18next';

import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';

import type { UseQueryResult } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import { DownloadCloud } from 'lucide-react';

import { hooks } from '@/config/queryClient';
import {
  DOWNLOAD_ACTIONS_BUTTON_CY,
  DOWNLOAD_DATA_BUTTON_CY,
} from '@/config/selectors';

function DownloadButtons() {
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
        const dataBlob = new Blob([JSON.stringify(data)], {
          type: 'text/plain;charset=utf-8',
        });
        const fileName = `${new Date().toISOString()}_${suffix}.json`;
        saveAs(dataBlob, fileName);
      });
    };

  const loadingLabel = isFetchingAppActions
    ? t('DOWNLOADING_LABEL')
    : t('DOWNLOAD_ACTIONS_LABEL');

  return (
    <Stack direction="row" justifyContent="center" spacing={2}>
      <LoadingButton
        data-cy={DOWNLOAD_ACTIONS_BUTTON_CY}
        onClick={handleClick(refetchAppActions, 'app_actions')}
        loading={isFetchingAppActions}
        startIcon={<DownloadCloud />}
        variant="outlined"
      >
        {loadingLabel}
      </LoadingButton>
      <LoadingButton
        data-cy={DOWNLOAD_DATA_BUTTON_CY}
        onClick={handleClick(refetchAppData, 'app_data')}
        loading={isFetchingAppData}
        startIcon={<DownloadCloud />}
        variant="outlined"
      >
        {isFetchingAppData ? t('DOWNLOADING_LABEL') : t('DOWNLOAD_DATA_LABEL')}
      </LoadingButton>
    </Stack>
  );
}
export default DownloadButtons;
