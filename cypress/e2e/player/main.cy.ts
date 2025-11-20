import { AppDataVisibility, Context, PermissionLevel } from '@graasp/sdk';

import {
  PLAYER_VIEW_CY,
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
  beforeEach(() => {
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
  });

  it('Show messages and write a new one', () => {
    cy.get(buildDataCy(PLAYER_VIEW_CY)).should('be.visible');

    // expect previously saved app data
    const previousAppData = defaultAppData[0];
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
});
