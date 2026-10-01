import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FiltersPanel } from './FiltersPanel';
import { EMPTY_FILTERS } from './types';

describe('FiltersPanel', () => {
  it('shows the search placeholder', () => {
    render(<FiltersPanel filters={EMPTY_FILTERS} onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Посада, технологія або компанія')).toBeTruthy();
  });
});
