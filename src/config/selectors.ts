export const TABLE_VIEW_TABLE_CYPRESS = 'table_view_table';
export const TABLE_VIEW_PANE_CYPRESS = 'table_view_pane';
export const SETTINGS_VIEW_PANE_CYPRESS = 'settings_view_pane';
export const BUILDER_VIEW_CY = 'builder-view';
export const ANALYTICS_VIEW_CY = 'analytics_view';
export const TAB_PRESET_VIEW_CYPRESS = 'tab_preset_view';
export const TAB_TABLE_VIEW_CYPRESS = 'tab_table_view';
export const TAB_ABOUT_VIEW_CYPRESS = 'tab_about_view';
export const TAB_SETTINGS_VIEW_CYPRESS = 'tab_settings_view';
export const TABLE_ROW_USERS_CYPRESS = 'table_row_users';
export const TABLE_VIEW_BODY_USERS_CYPRESS = 'table_view_body_users';
export const TABLE_VIEW_OPEN_REVIEW_BUTTON_CYPRESS =
  'table_view_open_review_button';
export const TABLE_VIEW_USER_REVIEW_DIALOG_CYPRESS =
  'table_view_user_review_dialog';
export const TABLE_VIEW_USERNAME_CELL_CYPRESS = 'table_view_username_cell';
export const TABLE_VIEW_HELP_NEEDED_CELL_CYPRESS =
  'table_view_help_needed_cell';
export const TABLE_VIEW_NB_COMMENTS_CELL_CYPRESS =
  'table_view_nb_comments_cell';
export const TABLE_VIEW_VIEW_COMMENTS_CELL_CYPRESS =
  'table_view_view_comments_cell';
export const TABLE_VIEW_REVIEW_DIALOG_CLOSE_BUTTON_CYPRESS =
  'table_view_review_dialog_close_button';

export const CUSTOM_DIALOG_TITLE_CYPRESS = 'custom_dialog_title';
export const CUSTOM_DIALOG_ACTIONS_CYPRESS = 'custom_dialog_actions';
export const CUSTOM_DIALOG_CONTENT_CY = 'custom_dialog_content';

export const NUMBER_OF_COMMENTS_CYPRESS = 'number_of_comments';
export const TABLE_NO_COMMENTS_CYPRESS = 'table_no_comments';
export const SETTINGS_SPEED_FAB_CYPRESS = 'settings_speed_fab';
export const DISPLAY_SETTINGS_FAB_CYPRESS = 'display_settings_fab';
export const CODE_SETTINGS_FAB_CYPRESS = 'code_settings_fab';
export const SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS =
  'settings_dialog_cancel_button';
export const SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS =
  'settings_dialog_save_button';
export const SETTINGS_CODE_DIALOG_WINDOW_CYPRESS =
  'settings_code_dialog_window';
export const SETTINGS_DISPLAY_DIALOG_WINDOW_CYPRESS =
  'settings_display_dialog_window';
export const SHOW_HEADER_SWITCH_CYPRESS = 'show_header_switch';
export const SHOW_TOOLBAR_SWITCH_CYPRESS = 'show_toolbar_switch';
export const SHOW_VERSION_NAVIGATION_SWITCH_CYPRESS =
  'show_version_navigation_switch';

export const tableRowUserCypress = (id: string): string =>
  `${TABLE_ROW_USERS_CYPRESS}-${id}`;

export const COMMENT_EDITOR_CYPRESS = 'comment_editor';
export const COMMENT_EDITOR_CANCEL_BUTTON_CYPRESS =
  'comment_editor_cancel_button';
export const COMMENT_EDITOR_SAVE_BUTTON_CYPRESS = 'comment_editor_save_button';
export const COMMENT_EDITOR_BOLD_BUTTON_CYPRESS = 'comment_editor_bold_button';
export const COMMENT_EDITOR_ITALIC_BUTTON_CYPRESS =
  'comment_editor_italic_button';
export const COMMENT_EDITOR_CODE_BUTTON_CYPRESS = 'comment_editor_code_button';
export const COMMENT_EDITOR_LINK_BUTTON_CYPRESS = 'comment_editor_link_button';
export const COMMENT_EDITOR_QUOTE_BUTTON_CYPRESS =
  'comment_editor_quote_button';
export const COMMENT_EDITOR_LINE_INFO_TEXT_CYPRESS =
  'comment_editor_line_info_text';
export const COMMENT_EDITOR_TEXTAREA_CYPRESS = 'comment_editor_textarea';
export const COMMENT_EDITOR_TEXTAREA_HELPER_TEXT_CY =
  'comment_editor_textarea_helper_text';
export const COMMENT_CONTAINER_CYPRESS = 'comment_container';
export const CHATBOT_PROMPT_CONTAINER_CY = 'chatbot_prompt_container';
export const COMMENT_RESPONSE_BOX_CY = 'comment-response-box';
export const buildCommentContainerDataCy = (id: string): string =>
  `${COMMENT_CONTAINER_CYPRESS}-${id}`;
export const buildChatbotPromptContainerDataCy = (id: string): string =>
  `${CHATBOT_PROMPT_CONTAINER_CY}-${id}`;

export const ORPHAN_BUTTON_CYPRESS = 'orphan_button';
export const CODE_EDITOR_ID_CY = 'code_editor';
export const SETTING_MAX_COMMENT_LENGTH = 'setting_max_comment_length';
export const SETTING_MAX_THREAD_LENGTH = 'setting_max_thread_length';
export const SETTING_ADD_CHATBOT_PROMPT_CY = 'setting_add_chatbot_prompt';

export const DOWNLOAD_ACTIONS_BUTTON_CY = 'download_actions_button';

export const DOWNLOAD_DATA_BUTTON_CY = 'download_data_button';

export const buildDataCy = (selector: string): string =>
  `[data-cy=${selector}]`;
export const buildTableRowCypress = (selector: string): string =>
  `[data-cy=${selector}]`;
export const buildCommitFieldCypress = (selector: string): string =>
  `[data-cy=${selector}]`;
export const settingKeyDataCy = (key: string): string => `setting-${key}`;

export const ANALYTICS_GENERAL_TOTAL_COMMENTS_ID =
  'general_statistic_total_comments';
export const ANALYTICS_GENERAL_WORDS_FREQUENCY_COMMENTS_ID =
  'general_statistic_words_frequency';
export const ANALYTICS_WORDS_CLOUD_MODAL_ID = 'analytics_words_cloud_modal';
export const KEYWORD_CHIP_COUNT_ID = 'keyword_count_id';
export const ADD_CUSTOM_WORD_INPUT_ID = 'custom_word_input_id';

export const buildKeywordChipId = (keyword: string): string =>
  `${keyword}_keyword_chip`;

export const buildCheckWholeMemberChatButtonId = (memberId: string): string =>
  `check_member_chat_button_id_${memberId}`;
export const CHATBOT_SETTINGS_SUMMARY_CY = 'chatbotSettingsSummary';
