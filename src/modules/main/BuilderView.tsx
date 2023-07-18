import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import AdminView from './AdminView';
import PlayerView from './PlayerView';

const BuilderView = (): JSX.Element => {
  const context = useLocalContext();

  switch (context.permission) {
    // show "teacher view"
    case PermissionLevel.Admin:
      return <AdminView />;
    case PermissionLevel.Read:
    default:
      return <PlayerView />;
  }
};

export default BuilderView;
