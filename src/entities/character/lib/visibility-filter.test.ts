import { passesVisibilityFilter } from '@/entities/character/lib/visibility-filter';

describe('passesVisibilityFilter', () => {
  const hiddenIds = new Set(['2']);

  it('excludes hidden characters when filter is "" (default)', () => {
    expect(passesVisibilityFilter('1', hiddenIds, '')).toBe(true);
    expect(passesVisibilityFilter('2', hiddenIds, '')).toBe(false);
  });

  it('excludes hidden characters when filter is "visible"', () => {
    expect(passesVisibilityFilter('1', hiddenIds, 'visible')).toBe(true);
    expect(passesVisibilityFilter('2', hiddenIds, 'visible')).toBe(false);
  });

  it('includes only hidden characters when filter is "hidden"', () => {
    expect(passesVisibilityFilter('1', hiddenIds, 'hidden')).toBe(false);
    expect(passesVisibilityFilter('2', hiddenIds, 'hidden')).toBe(true);
  });

  it('includes everything when filter is "all"', () => {
    expect(passesVisibilityFilter('1', hiddenIds, 'all')).toBe(true);
    expect(passesVisibilityFilter('2', hiddenIds, 'all')).toBe(true);
  });
});
