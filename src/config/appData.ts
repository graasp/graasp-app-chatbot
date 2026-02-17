import type { AppData } from '@graasp/sdk';

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
  /**
   * Id of the conversation in which the comment belongs to
   * Legacy data have an undefined value
   */
  conversationId?: string;
};
export type CommentAppData = AppData<CommentData>;
