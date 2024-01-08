import { AppData } from '@graasp/sdk';

export const AppDataTypes = {
  UserComment: 'comment',
  BotComment: 'bot-comment',
};

export const COMMENT_APP_DATA_TYPES: string[] = [
  AppDataTypes.UserComment,
  AppDataTypes.BotComment,
];

export type VisibilityVariants = 'member' | 'item';

export type CommentData = {
  content: string;
  parent: string | null;
  chatbotPromptSettingId?: string;
};
export type CommentAppData = AppData<CommentData>;
