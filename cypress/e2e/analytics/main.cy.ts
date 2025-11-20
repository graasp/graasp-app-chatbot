import { Context, PermissionLevel } from '@graasp/sdk';

import {
  ADD_CUSTOM_WORD_INPUT_ID,
  ANALYTICS_GENERAL_TOTAL_COMMENTS_ID,
  ANALYTICS_GENERAL_WORDS_FREQUENCY_COMMENTS_ID,
  ANALYTICS_VIEW_CY,
  ANALYTICS_WORDS_CLOUD_MODAL_ID,
  KEYWORD_CHIP_COUNT_ID,
  PLAYER_VIEW_CY,
  buildCheckWholeMemberChatButtonId,
  buildDataCy,
  buildKeywordChipId,
} from '../../../src/config/selectors';
import { actions } from '../../fixtures/mockActions';
import { APP_ITEM } from '../../fixtures/mockItem';
import { MOCK_APP_SETTING } from '../../fixtures/mockSettings';

describe('Analytics View', () => {
  beforeEach(() => {
    cy.setUpApi(
      {
        items: [APP_ITEM],
        appActions: actions,
        appSettings: [MOCK_APP_SETTING],
      },
      {
        context: Context.Analytics,
        permission: PermissionLevel.Admin,
        itemId: APP_ITEM.id,
      },
    );
    cy.visit('/');
  });

  it('App', () => {
    cy.get(buildDataCy(ANALYTICS_VIEW_CY)).should('be.visible');
  });

  describe('getting general statistics cards', () => {
    it('check total user comments statistic card display the right value', () => {
      cy.get(`#${ANALYTICS_GENERAL_TOTAL_COMMENTS_ID}`).scrollIntoView();
      cy.get(`#${ANALYTICS_GENERAL_TOTAL_COMMENTS_ID}`).should(
        'have.text',
        actions.length,
      );
    });

    it('word cloud opening a modal', () => {
      cy.get(`#${ANALYTICS_GENERAL_WORDS_FREQUENCY_COMMENTS_ID}`).should(
        'be.visible',
      );
      cy.get(`#${ANALYTICS_GENERAL_WORDS_FREQUENCY_COMMENTS_ID}`).click();
      cy.get(`#${ANALYTICS_WORDS_CLOUD_MODAL_ID}`).should('be.visible');
    });
  });

  describe('frequent words section', () => {
    it('check count of frequent word', () => {
      cy.get(`#${ADD_CUSTOM_WORD_INPUT_ID}`).type('complex{enter}');
      cy.get(
        `#${buildKeywordChipId('complex')} #${KEYWORD_CHIP_COUNT_ID}`,
      ).should('have.text', 2);
    });

    it('add new custom word', () => {
      cy.get(`#${ADD_CUSTOM_WORD_INPUT_ID}`).type('elephants{enter}');
      cy.get(`#${buildKeywordChipId('elephants')}`).should('be.visible');
    });

    it('display the whole chat', () => {
      cy.get(
        `#${buildCheckWholeMemberChatButtonId(actions[0]?.account?.id)}`,
      ).click();
      cy.get(buildDataCy(PLAYER_VIEW_CY)).should('be.visible');
    });
  });
});
