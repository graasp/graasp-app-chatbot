import { Context, PermissionLevel } from '@graasp/sdk';

import {
  BUILDER_VIEW_CY,
  CHATBOT_SETTINGS_SUMMARY_CY,
  TAB_SETTINGS_VIEW_CYPRESS,
  buildDataCy,
} from '../../../src/config/selectors';
import { MOCK_APP_SETTING } from '../../fixtures/mockSettings';

const EDIT_SETTINGS_BUTTON = '[type="button"]:contains("Edit")';
const SAVE_SETTINGS_BUTTON = '[type="button"]:contains("Save")';
const PROMPT_TEXT_AREA = '[name="Chatbot Prompt"]';
const CUE_TEXT_AREA = '[name="Conversation Starter"]';
const CHATBOT_NAME_INPUT = '[name="Chatbot Name"]';

const ADD_STARTER_SUGGESTION_BUTTON = '[title="Add starter suggestion"]';
const buildStarterSuggestionInput = (idx: number) =>
  `[name="Starter suggestion number ${idx}"]`;

describe('Builder View', () => {
  it('Results table', () => {
    cy.setUpApi(
      {},
      {
        context: Context.Builder,
        permission: PermissionLevel.Admin,
      },
    );
    cy.visit('/');

    cy.get(buildDataCy(BUILDER_VIEW_CY)).should(
      'contain.text',
      'Conversations',
    );
  });

  it('Settings show default values and create new values', () => {
    cy.setUpApi(
      {},
      {
        context: Context.Builder,
        permission: PermissionLevel.Admin,
      },
    );
    cy.visit('/');

    cy.get(buildDataCy(TAB_SETTINGS_VIEW_CYPRESS)).click();

    // show default values
    cy.get(buildDataCy(CHATBOT_SETTINGS_SUMMARY_CY))
      .should('contain', 'Graasp Bot')
      .should('contain', '-');

    cy.get(EDIT_SETTINGS_BUTTON).click();

    // change prompt
    const prompt = 'my new prompt';
    cy.get(PROMPT_TEXT_AREA).type(prompt);

    // change cue
    const cue = 'my new cue';
    cy.get(CUE_TEXT_AREA).type(cue);

    cy.get(SAVE_SETTINGS_BUTTON).click();

    // show default values
    cy.get(buildDataCy(CHATBOT_SETTINGS_SUMMARY_CY))
      .should('contain', 'Graasp Bot')
      .should('contain', prompt)
      .should('contain', cue);
  });

  it('Settings show current values and updates', () => {
    cy.setUpApi(
      { appSettings: [MOCK_APP_SETTING] },
      {
        context: Context.Builder,
        permission: PermissionLevel.Admin,
      },
    );
    cy.visit('/');

    cy.get(buildDataCy(TAB_SETTINGS_VIEW_CYPRESS)).click();

    // show default values
    cy.get(buildDataCy(CHATBOT_SETTINGS_SUMMARY_CY))
      .should('contain', MOCK_APP_SETTING.data.chatbotName)
      .should('contain', MOCK_APP_SETTING.data.initialPrompt)
      .should('contain', MOCK_APP_SETTING.data.chatbotCue);

    cy.get(EDIT_SETTINGS_BUTTON).click();

    // change name
    const name = 'my new prompt';
    cy.get(CHATBOT_NAME_INPUT).clear().type(name);

    // change prompt
    const prompt = 'my new prompt';
    cy.get(PROMPT_TEXT_AREA).clear().type(prompt);

    // change cue
    const cue = 'my new cue';
    cy.get(CUE_TEXT_AREA).clear().type(cue);

    cy.get(SAVE_SETTINGS_BUTTON).click();

    // show default values
    cy.get(buildDataCy(CHATBOT_SETTINGS_SUMMARY_CY))
      .should('contain', name)
      .should('contain', prompt)
      .should('contain', cue);
  });

  it.only('Show starter suggestions and edit', () => {
    cy.setUpApi(
      { appSettings: [] },
      {
        context: Context.Builder,
        permission: PermissionLevel.Admin,
      },
    );
    cy.visit('/');

    cy.get(buildDataCy(TAB_SETTINGS_VIEW_CYPRESS)).click();

    cy.get(EDIT_SETTINGS_BUTTON).click();

    // change prompt
    const prompt = 'my new prompt';
    cy.get(PROMPT_TEXT_AREA).clear().type(prompt);

    const newSuggestions = ['Hello', 'Hello1', 'Hello2'];

    // add suggestions
    newSuggestions.forEach((s, idx) => {
      cy.get(ADD_STARTER_SUGGESTION_BUTTON).click();
      cy.get(buildStarterSuggestionInput(idx)).type(s);
    });

    cy.get(SAVE_SETTINGS_BUTTON).click();

    // show starter suggestions
    for (const s of newSuggestions) {
      cy.get(`li:contains('${s}')`).should('be.visible');
    }

    cy.wait(1000);
    cy.get(EDIT_SETTINGS_BUTTON).click();

    // edit suggestions
    const editedSuggestions = ['newHello0', 'newHello1', 'newHello2'];
    editedSuggestions.forEach((s, idx) => {
      cy.get(buildStarterSuggestionInput(idx)).clear().type(s);
    });

    // delete second suggestion
    cy.get(`[title="Delete suggestion number 1"]`).click();

    // expect remaining suggestions
    const remainingSuggestions = [editedSuggestions[0], editedSuggestions[2]];
    for (const s of remainingSuggestions) {
      cy.get(`[value="${s}"]`).should('be.visible');
    }

    cy.get(SAVE_SETTINGS_BUTTON).click();

    // show starter suggestions
    for (const s of remainingSuggestions) {
      cy.get(`li:contains('${s}')`).should('be.visible');
    }
  });
});
