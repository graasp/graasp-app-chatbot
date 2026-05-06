import { AppDataVisibility, Context, PermissionLevel } from '@graasp/sdk';

import type { CommentAppData } from '../../../src/config/appData';
import {
  DELETE_CONVERSATION_BUTTON_CY,
  DELETE_CONVERSATION_CONFIRM_BUTTON_CY,
  DELETE_CONVERSATION_DIALOG_CY,
  buildCommentContainerDataCy,
  buildDataCy,
} from '../../../src/config/selectors';
import { CURRENT_MEMBER } from '../../fixtures/members';
import { MOCK_SERVER_ITEM } from '../../fixtures/mockItem';
import { MOCK_APP_SETTING } from '../../fixtures/mockSettings';

const defaultAppData = [
  {
    account: CURRENT_MEMBER,
    createdAt: '2025-11-18T16:35:22.010Z',
    creator: CURRENT_MEMBER,
    data: { content: 'A previously saved message' },
    id: '0',
    item: MOCK_SERVER_ITEM,
    type: 'comment',
    updatedAt: '2025-11-18T16:35:22.010Z',
    visibility: AppDataVisibility.Member,
  },
];

const MESSAGE_INPUT = 'textarea[name="Message"]';
const SEND_BUTTON = '[name="Send message"]';

const goToConversation = (appData: CommentAppData) => {
  const txt = appData.data.content;
  cy.contains('tr', txt.slice(0, 10))
    .find('button[title="Open conversation"]')
    .click();
};

const createConversation = () => {
  cy.get('button:contains("New conversation")').click();
};

describe('Player View', () => {
  it('Show messages and write a new one', () => {
    cy.setUpApi(
      {
        appData: defaultAppData,
        appSettings: [MOCK_APP_SETTING],
      },
      {
        context: Context.Player,
        permission: PermissionLevel.Write,
      },
    );
    cy.visit('/');

    // go to conversation
    goToConversation(defaultAppData[0]);

    // expect previously saved app data
    const [previousAppData] = defaultAppData;
    cy.get(buildDataCy(buildCommentContainerDataCy(previousAppData.id))).should(
      'contain',
      previousAppData.data.content,
    );

    // type and send message
    const message = 'My message';
    cy.get(MESSAGE_INPUT).type(message);
    cy.get(SEND_BUTTON).click();

    // expect user message
    cy.get(buildDataCy(buildCommentContainerDataCy('1'))).should(
      'contain',
      message,
    );

    // expect chatbot message
    cy.get(buildDataCy(buildCommentContainerDataCy('2'))).should(
      'contain',
      'i am a bot', // default return value of the mocked chatbot
    );
  });

  it('Show cue and write a message', () => {
    cy.setUpApi(
      {
        appData: [],
        appSettings: [MOCK_APP_SETTING],
      },
      {
        context: Context.Player,
        permission: PermissionLevel.Write,
      },
    );
    cy.visit('/');
    createConversation();

    // expect cue
    cy.get(buildDataCy(buildCommentContainerDataCy('cue'))).should(
      'contain',
      MOCK_APP_SETTING.data.chatbotCue,
    );

    // type and send message
    const message = 'My message';
    cy.get(MESSAGE_INPUT).type(message);
    cy.get(SEND_BUTTON).click();

    // expect user message
    cy.get(buildDataCy(buildCommentContainerDataCy('2'))).should(
      'contain',
      message,
    );

    // expect chatbot message
    cy.get(buildDataCy(buildCommentContainerDataCy('3'))).should(
      'contain',
      'i am a bot', // default return value of the mocked chatbot
    );
  });

  it('Show dates', () => {
    const appData = [
      {
        account: CURRENT_MEMBER,
        createdAt: '2025-11-18T16:35:22.010Z',
        creator: CURRENT_MEMBER,
        data: { content: 'A previously saved message' },
        id: '0',
        item: MOCK_SERVER_ITEM,
        type: 'comment',
        updatedAt: '2025-11-18T16:35:22.010Z',
        visibility: AppDataVisibility.Member,
      },
      {
        account: CURRENT_MEMBER,
        createdAt: '2024-11-18T16:35:22.010Z',
        creator: CURRENT_MEMBER,
        data: { content: 'A previously saved message' },
        id: '1',
        item: MOCK_SERVER_ITEM,
        type: 'comment',
        updatedAt: '2025-11-18T16:35:22.010Z',
        visibility: AppDataVisibility.Member,
      },
    ];
    cy.setUpApi(
      {
        appData,
        appSettings: [MOCK_APP_SETTING],
      },
      {
        context: Context.Player,
        permission: PermissionLevel.Write,
      },
    );
    cy.visit('/');
    // go to conversation
    goToConversation(appData[0]);

    // expect dates
    cy.get('#root').should('contain', 'November 18, 2024');
    cy.get('#root').should('contain', 'November 18, 2025');
  });

  it('Use a starter suggestion', () => {
    cy.setUpApi(
      {
        appData: [],
        appSettings: [MOCK_APP_SETTING],
      },
      {
        context: Context.Player,
        permission: PermissionLevel.Write,
      },
    );
    cy.visit('/');
    createConversation();

    const [suggestion] = MOCK_APP_SETTING.data.starterSuggestions;

    // click suggestion
    cy.get(`button:contains("${suggestion}")`).click();

    // expect user message
    cy.get(buildDataCy(buildCommentContainerDataCy('2'))).should(
      'contain',
      suggestion,
    );

    // expect chatbot message
    cy.get(buildDataCy(buildCommentContainerDataCy('3'))).should(
      'contain',
      'i am a bot', // default return value of the mocked chatbot
    );

    cy.get('button').should('not.contain', suggestion);
  });

  it('Type and send messages with enter key', () => {
    cy.setUpApi(
      {
        appData: [],
        appSettings: [MOCK_APP_SETTING],
      },
      {
        context: Context.Player,
        permission: PermissionLevel.Write,
      },
    );
    cy.visit('/');
    createConversation();

    // type and send message with enter key
    const message = 'My message';
    cy.get(MESSAGE_INPUT).type(message).type('{enter}');

    // expect user message
    cy.get(buildDataCy(buildCommentContainerDataCy('2'))).should(
      'contain',
      message,
    );

    // type and send message with enter key
    const message1 = 'My second message';
    cy.get(MESSAGE_INPUT).type(message1, { delay: 20 }).type('{enter}');

    // expect message to not be sent
    cy.get('[role="log"]').should('not.contain', message1);

    // explicitely wait for chatbot to answer before sending another message
    cy.wait(1000);

    cy.get(MESSAGE_INPUT).type('{enter}');

    // expect user message
    cy.get(buildDataCy(buildCommentContainerDataCy('4'))).should(
      'contain',
      message1,
    );
  });

  it('Show all conversations', () => {
    const appData = [
      // first conversation
      {
        account: CURRENT_MEMBER,
        createdAt: '2026-11-18T16:35:22.010Z',
        creator: CURRENT_MEMBER,
        data: {
          content: 'My conversation',
          conversationId: 'conversation-id-2',
        },
        id: '12',
        item: MOCK_SERVER_ITEM,
        type: 'comment',
        updatedAt: '2026-11-18T16:35:22.010Z',
        visibility: AppDataVisibility.Member,
      },
      // second, legacy conversation
      {
        account: CURRENT_MEMBER,
        createdAt: '2025-10-18T16:35:22.010Z',
        creator: CURRENT_MEMBER,
        data: { content: 'A previously saved message' },
        id: '0',
        item: MOCK_SERVER_ITEM,
        type: 'comment',
        updatedAt: '2025-11-18T16:35:22.010Z',
        visibility: AppDataVisibility.Member,
      },
      {
        account: CURRENT_MEMBER,
        createdAt: '2024-01-18T16:35:22.010Z',
        creator: CURRENT_MEMBER,
        data: { content: 'Another saved message' },
        id: '14',
        item: MOCK_SERVER_ITEM,
        type: 'comment',
        updatedAt: '2025-11-18T17:35:22.010Z',
        visibility: AppDataVisibility.Member,
      },
      // third conversation
      {
        account: CURRENT_MEMBER,
        createdAt: '2023-11-18T16:35:22.010Z',
        creator: CURRENT_MEMBER,
        data: {
          content: 'A question I asked',
          conversationId: 'conversation-id-1',
        },
        id: '13',
        item: MOCK_SERVER_ITEM,
        type: 'comment',
        updatedAt: '2023-11-18T16:35:22.010Z',
        visibility: AppDataVisibility.Member,
      },
    ];
    cy.setUpApi(
      {
        appData,
        appSettings: [MOCK_APP_SETTING],
      },
      {
        context: Context.Player,
        permission: PermissionLevel.Write,
      },
    );
    cy.visit('/');

    // should show 3 conversations ordered by creation date desc
    cy.get('tr').then((rows) => {
      expect(rows).to.have.length(3);

      expect(rows[0]).to.contain(appData[0].data.content);
      // content is cut because it is too long
      expect(rows[1]).to.contain(appData[2].data.content.slice(0, 10));
      expect(rows[2]).to.contain(appData[3].data.content);
    });

    // go to first conversation and show one message
    goToConversation(appData[0]);
    // expect one user message only
    cy.get(buildDataCy(buildCommentContainerDataCy(appData[0].id))).should(
      'be.visible',
    );
    cy.get(buildDataCy(buildCommentContainerDataCy(appData[1].id))).should(
      'not.exist',
    );

    // go back to conversations
    cy.get('button:contains("Go back to conversations")').click();

    // go to second legacy conversation
    goToConversation(appData[2]);
    // expect one user message only
    cy.get(buildDataCy(buildCommentContainerDataCy(appData[1].id))).should(
      'be.visible',
    );
    cy.get(buildDataCy(buildCommentContainerDataCy(appData[2].id))).should(
      'be.visible',
    );
    cy.get(buildDataCy(buildCommentContainerDataCy(appData[3].id))).should(
      'not.exist',
    );
  });

  describe('Delete conversation', () => {
    const conversationAppData = [
      {
        account: CURRENT_MEMBER,
        createdAt: '2025-11-18T16:35:22.010Z',
        creator: CURRENT_MEMBER,
        data: { content: 'First message', conversationId: 'conv-1' },
        id: 'dce688ee-d3e3-4839-8d6f-40b7112c9451',
        item: MOCK_SERVER_ITEM,
        type: 'comment',
        updatedAt: '2025-11-18T16:35:22.010Z',
        visibility: AppDataVisibility.Member,
      },
      {
        account: CURRENT_MEMBER,
        createdAt: '2025-11-18T16:36:00.000Z',
        creator: CURRENT_MEMBER,
        data: { content: 'Second message', conversationId: 'conv-1' },
        id: 'd7bb1914-ab1d-4242-b67f-11b23b6669f3',
        item: MOCK_SERVER_ITEM,
        type: 'comment',
        updatedAt: '2025-11-18T16:36:00.000Z',
        visibility: AppDataVisibility.Member,
      },
      {
        account: CURRENT_MEMBER,
        createdAt: '2025-10-01T10:00:00.000Z',
        creator: CURRENT_MEMBER,
        data: { content: 'Another conversation', conversationId: 'conv-2' },
        id: 'de37b417-c56a-4b04-a165-44470669246e',
        item: MOCK_SERVER_ITEM,
        type: 'comment',
        updatedAt: '2025-10-01T10:00:00.000Z',
        visibility: AppDataVisibility.Member,
      },
    ];

    beforeEach(() => {
      cy.setUpApi(
        { appData: conversationAppData, appSettings: [MOCK_APP_SETTING] },
        { context: Context.Player, permission: PermissionLevel.Write },
      );
      cy.visit('/');
    });

    it('shows a delete button for each conversation', () => {
      cy.get('tr').should('have.length', 2);
      cy.get(buildDataCy(DELETE_CONVERSATION_BUTTON_CY)).should(
        'have.length',
        2,
      );
    });

    it('opens a confirmation dialog when delete is clicked', () => {
      cy.get(buildDataCy(DELETE_CONVERSATION_DIALOG_CY)).should('not.exist');
      cy.get(buildDataCy(DELETE_CONVERSATION_BUTTON_CY)).first().click();
      cy.get(buildDataCy(DELETE_CONVERSATION_DIALOG_CY)).should('be.visible');
    });

    it('cancels deletion and keeps the conversation', () => {
      cy.get(buildDataCy(DELETE_CONVERSATION_BUTTON_CY)).first().click();
      cy.get(buildDataCy(DELETE_CONVERSATION_DIALOG_CY)).should('be.visible');
      cy.contains('button', 'Cancel').click();
      cy.get(buildDataCy(DELETE_CONVERSATION_DIALOG_CY)).should('not.exist');
      cy.get('tr').should('have.length', 2);
    });

    it('deletes a conversation and removes it from the list', () => {
      cy.get('tr').should('have.length', 2);
      cy.get(buildDataCy(DELETE_CONVERSATION_BUTTON_CY)).first().click();
      cy.get(buildDataCy(DELETE_CONVERSATION_CONFIRM_BUTTON_CY)).click();
      cy.get(buildDataCy(DELETE_CONVERSATION_DIALOG_CY)).should('not.exist');
      cy.get('tr').should('have.length', 1);
      cy.get('tr').should('contain', 'Another conversation');
    });
  });
});
