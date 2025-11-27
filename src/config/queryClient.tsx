import { toast } from 'react-toastify';

import type { Notifier } from '@graasp/apps-query-client';
import { configureQueryClient } from '@graasp/apps-query-client';

import type { AxiosError } from 'axios';

import { NetworkErrorToast } from '@/modules/common/CustomToasts';

import { API_HOST, GRAASP_APP_KEY, MOCK_API } from './env';

const notifier: Notifier = (data) => {
  const { payload } = data;
  if (payload) {
    // axios error
    if (
      payload.error &&
      'AxiosError' === payload.error.name &&
      (payload.error as AxiosError).response
    ) {
      const message = (
        (payload.error as AxiosError).response?.data as
          | {
              message: string;
            }
          | undefined
      )?.message;
      toast.error(
        <NetworkErrorToast
          title={payload.error.message}
          description={message}
        />,
      );
    }
  }
};

const {
  queryClient,
  QueryClientProvider,
  hooks,
  API_ROUTES,
  mutations,
  ReactQueryDevtools,
} = configureQueryClient({
  API_HOST,
  notifier,
  refetchOnWindowFocus: !import.meta.env.DEV,
  keepPreviousData: true,
  // avoid refetching when same data are closely fetched
  staleTime: 1000, // ms
  GRAASP_APP_KEY,
  isStandalone: MOCK_API,
});

export {
  ReactQueryDevtools,
  queryClient,
  QueryClientProvider,
  hooks,
  mutations,
  API_ROUTES,
};
