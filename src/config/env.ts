const {
  VITE_GRAASP_APP_KEY,
  VITE_VERSION,
  VITE_SENTRY_ENV,
  VITE_SENTRY_DSN,
  VITE_GA_MEASUREMENT_ID,
  VITE_ENABLE_MOCK_API,
  VITE_API_HOST,
  VITE_OPEN_AI_API_URL,
} = window.Cypress ? Cypress.env() : import.meta.env;

export const MOCK_API = 'true' === VITE_ENABLE_MOCK_API;
export const GA_MEASUREMENT_ID = VITE_GA_MEASUREMENT_ID;
export const API_HOST = VITE_API_HOST;
export const VERSION = VITE_VERSION || 'latest';
export const GRAASP_APP_KEY = VITE_GRAASP_APP_KEY;
export const SENTRY_ENV = VITE_SENTRY_ENV;
export const SENTRY_DSN = VITE_SENTRY_DSN;

export const OPEN_AI_API_URL = VITE_OPEN_AI_API_URL;
