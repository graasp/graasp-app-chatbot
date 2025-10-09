import { toast } from 'react-toastify';

import { SUCCESS_MESSAGE, UNEXPECTED_ERROR_MESSAGE } from '@/constants';

const showErrorToast = (payload: string | { message: string }): void => {
  let message = UNEXPECTED_ERROR_MESSAGE;
  if ('string' === typeof payload) {
    message = payload;
  } else {
    ({ message } = payload);
  }

  toast.error(message, {
    toastId: message,
    position: 'bottom-right',
  });
};

const showSuccessToast = (payload: string | { message: string }): void => {
  let message = SUCCESS_MESSAGE;
  if ('string' === typeof payload) {
    message = payload;
  } else {
    ({ message } = payload);
  }

  toast.success(message, {
    toastId: message,
    position: 'bottom-right',
  });
};

export { showErrorToast, showSuccessToast };
