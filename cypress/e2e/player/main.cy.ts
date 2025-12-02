import { AppDataVisibility, Context, PermissionLevel } from '@graasp/sdk';

import {
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

    // expect previously saved app data
    const [previousAppData] = defaultAppData;
    cy.get(buildDataCy(buildCommentContainerDataCy(previousAppData.id))).should(
      'contain',
      previousAppData.data.content,
    );

    // type and send message
    const message = 'My message';
    cy.get('[role="textbox"]').type(message);
    cy.get('[name="send"]').click();

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

    // expect cue
    cy.get(buildDataCy(buildCommentContainerDataCy('cue'))).should(
      'contain',
      MOCK_APP_SETTING.data.chatbotCue,
    );

    // type and send message
    const message = 'My message';
    cy.get('[role="textbox"]').type(message);
    cy.get('[name="send"]').click();

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
    cy.setUpApi(
      {
        appData: [
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
        ],
        appSettings: [MOCK_APP_SETTING],
      },
      {
        context: Context.Player,
        permission: PermissionLevel.Write,
      },
    );
    cy.visit('/');

    // expect dates
    cy.get('#root').should('contain', 'November 18, 2024');
    cy.get('#root').should('contain', 'November 18, 2025');
  });

  it.only('Use a starter suggestion', () => {
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

    cy.get(`button:contains("${suggestion}")`).should('not.be.visible');
  });
});
