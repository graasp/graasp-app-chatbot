import React, { FC, ReactElement, createContext, useMemo } from 'react';

import { Member } from '@graasp/sdk';

import { hooks } from '../../config/queryClient';
import Loader from '../common/Loader';

export type MembersContextType = Member[];

const defaultContextValue = [] as Member[];
const MembersContext = createContext<MembersContextType>(defaultContextValue);

type Prop = {
  children: ReactElement | ReactElement[];
};

export const MembersProvider: FC<Prop> = ({ children }) => {
  const appContext = hooks.useAppContext();

  const members = useMemo(() => {
    const updatedMembers = appContext.data?.members.toJS() as
      | Member[]
      | undefined;

    return updatedMembers ?? defaultContextValue;
  }, [appContext.data]);

  if (appContext.isLoading) {
    return <Loader />;
  }

  return (
    <MembersContext.Provider value={members}>
      {children}
    </MembersContext.Provider>
  );
};

export const useMembersContext = (): MembersContextType =>
  React.useContext<MembersContextType>(MembersContext);
