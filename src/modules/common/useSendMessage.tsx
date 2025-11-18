import { AppDataTypes } from '@/config/appData';
import { mutations } from '@/config/queryClient';

export const useSendMessage = () => {
  const { mutateAsync: postAppDataAsync, isLoading } =
    mutations.usePostAppData();

  const sendMessage = async (newUserComment: string) => {
    const userData = {
      content: newUserComment,
    };
    // post new user comment as appData with normal call
    const userMessage = await postAppDataAsync({
      data: userData,
      type: AppDataTypes.UserComment,
    });

    return userMessage;
  };

  return { sendMessage, isLoading };
};
