import { useState } from 'react';

export function useSort(defaultColumn = 'name', defaultOrder = 'asc') {
  const [sortBy, setSortBy] = useState(defaultColumn);
  const [sortOrder, setSortOrder] = useState(defaultOrder);

  function toggleSort(column) {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  }

  return { sortBy, sortOrder, toggleSort };
}
