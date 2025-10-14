import type { Database } from '@graasp/apps-query-client';
import type { LocalContext } from '@graasp/sdk';

// oxlint-disable consistent-type-definitions
// oxlint-disable eslint(vars-on-top)

declare global {
  var appContext: LocalContext;
  var database: Database;
  interface Global {
    Cypress: boolean;
    database: Database;
    apiErrors: object;
  }
  interface Window {
    Cypress: boolean;
    database: Database;
    apiErrors: object;
    appContext: LocalContext;
  }
}

export {};
