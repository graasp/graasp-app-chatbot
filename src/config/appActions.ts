export const AppActionsType = {
  // Message actions
  Create: 'create_comment',
  Edit: 'edit_comment',
  Delete: 'delete_comment',
  Reply: 'reply_comment',
  // chatbot actions
  AskChatbot: 'ask_chatbot',
  UseStarter: 'use_starter',
} as const;
