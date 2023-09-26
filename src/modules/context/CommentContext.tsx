import React, { FC, ReactElement, createContext } from 'react';

import { ImmutableCast } from '@graasp/sdk/frontend';

import { CommentType } from '@/interfaces/comment';

const defaultContextValue = {};
const CommentContext = createContext<ImmutableCast<CommentType>>(
  defaultContextValue as ImmutableCast<CommentType>,
);

type Prop = {
  value: ImmutableCast<CommentType>;
  children: ReactElement;
};

export const CommentProvider: FC<Prop> = ({ children, value }) => {
  // eslint-disable-next-line no-console
  console.log(value, value.toJS());
  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
};

export const useCommentContext = (): ImmutableCast<CommentType> =>
  React.useContext<ImmutableCast<CommentType>>(CommentContext);
