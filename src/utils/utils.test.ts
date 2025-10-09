import { describe, expect, it } from 'vitest';

import { getInitials } from './utils';

describe('initials util', () => {
  it('simple 2 part name', () => {
    expect(getInitials('Bob Doe')).toBe('BD');
  });
  it('single part name', () => {
    expect(getInitials('Bob')).toBe('B');
  });
  it('name with hyphen', () => {
    expect(getInitials('Bob-Doe')).toBe('BD');
  });
  it('special char at beginning of second name', () => {
    expect(getInitials('Bob (Doe)')).toBe('BD');
  });
  it('3 part name', () => {
    expect(getInitials('Bob doe the Great')).toBe('BdtG');
  });
  it('only special symbols', () => {
    expect(getInitials(String.raw`~/\%`)).toBe('');
  });
});
