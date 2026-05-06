import { Suspense, lazy, useEffect } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { Context } from '@graasp/sdk';

import i18n, { DEFAULT_LANGUAGE } from '../config/i18n';
import Loader from './common/Loader';

const AnalyticsView = lazy(() => import('./main/AnalyticsView'));
const BuilderView = lazy(() => import('./main/BuilderView'));
const PlayerView = lazy(() => import('./main/PlayerView'));

function App(): JSX.Element {
  const context = useLocalContext();

  useEffect(() => {
    // handle a change of language
    const lang = context?.lang ?? DEFAULT_LANGUAGE;
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [context]);

  let view: JSX.Element;
  switch (context.context) {
    case Context.Builder:
      view = <BuilderView />;
      break;
    case Context.Analytics:
      view = <AnalyticsView />;
      break;
    case Context.Player:
    default:
      view = <PlayerView />;
  }

  return <Suspense fallback={<Loader>App</Loader>}>{view}</Suspense>;
}

export default App;
