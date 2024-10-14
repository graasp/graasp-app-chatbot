import { AccountType, CompleteMember, MemberFactory } from '@graasp/sdk';

export const MEMBERS: { [key: string]: CompleteMember } = {
  ANNA: MemberFactory({
    id: '0f0a2774-a965-4b97-afb4-bccc3796e060',
    name: 'anna',
    type: AccountType.Individual,
    email: 'anna@graasp.org',
  }),
  BOB: MemberFactory({
    id: '1f0a2774-a965-4b97-afb4-bccc3796e060',
    name: 'bob',
    type: AccountType.Individual,
    email: 'bob@graasp.org',
  }),
};

export const CURRENT_MEMBER = MEMBERS.ANNA;
