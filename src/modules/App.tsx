import { useEffect } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { Context } from '@graasp/sdk';

import i18n, { DEFAULT_LANGUAGE } from '../config/i18n';
import AnalyticsView from './main/AnalyticsView';
import BuilderView from './main/BuilderView';
import PlayerView from './main/PlayerView';

const App = (): JSX.Element => {
  const context = useLocalContext();

  useEffect(() => {
    // handle a change of language
    const lang = context?.lang ?? DEFAULT_LANGUAGE;
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [context]);

  switch (context.context) {
    case Context.Builder:
      return <BuilderView />;

    case Context.Analytics:
      return <AnalyticsView />;

    case Context.Player:
    default:
      return <PlayerView />;
  }
};

export default App;
