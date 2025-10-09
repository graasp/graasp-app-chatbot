/// <reference types="../../src/global.d.ts" />
import type { Database } from '@graasp/apps-query-client';
import type { LocalContext } from '@graasp/sdk';
import { Context } from '@graasp/sdk';

import { CURRENT_MEMBER, MEMBERS } from '../fixtures/members';
import { MOCK_SERVER_ITEM } from '../fixtures/mockItem';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // oxlint-disable-next-line typescript-eslint(consistent-type-definitions)
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      setUpApi(
        database: Partial<Database>,
        appContext: Partial<LocalContext>,
      ): void;
    }
  }
}

Cypress.Commands.add(
  'setUpApi',
  (database: Partial<Database>, appContext: Partial<LocalContext>) => {
    Cypress.on('window:before:load', (win) => {
      // win.indexedDB.deleteDatabase('graasp-app-cypress');
      // @ts-expect-error
      win.appContext = {
        accountId: CURRENT_MEMBER.id,
        itemId: MOCK_SERVER_ITEM.id,
        apiHost: Cypress.env('VITE_API_HOST'),
        context: Context.Player,
        ...appContext,
      };
      // @ts-expect-error
      win.database = {
        appData: [],
        appActions: [],
        appSettings: [],
        members: Object.values(MEMBERS),
        items: [MOCK_SERVER_ITEM],
        ...database,
      };
    });
  },
);
