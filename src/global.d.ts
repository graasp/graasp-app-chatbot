import { Database } from '@graasp/apps-query-client';
import { LocalContext } from '@graasp/sdk';

declare global {
  // eslint-disable-next-line
  var appContext: LocalContext;
  interface Global {
    Cypress: boolean;
    database: Database;
    apiErrors: object;
  }
}

export {};
