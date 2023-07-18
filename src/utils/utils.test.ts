import { describe, expect, it } from 'vitest';

import { getInitials } from './utils';

describe('Initials util', () => {
  it('simple 2 part name', () => {
    expect(getInitials('Bob Doe')).toEqual('BD');
  });
  it('single part name', () => {
    expect(getInitials('Bob')).toEqual('B');
  });
  it('name with hyphen', () => {
    expect(getInitials('Bob-Doe')).toEqual('BD');
  });
  it('special char at beginning of second name', () => {
    expect(getInitials('Bob (Doe)')).toEqual('BD');
  });
  it('3 part name', () => {
    expect(getInitials('Bob doe the Great')).toEqual('BdtG');
  });
  it('only special symbols', () => {
    expect(getInitials('~/\\%')).toEqual('');
  });
});
