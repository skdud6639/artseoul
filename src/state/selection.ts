import { createContext, useContext } from 'react';

export interface SelectionState {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
}

export const SelectionContext = createContext<SelectionState | null>(null);

export function useSelection(): SelectionState {
  const context = useContext(SelectionContext);
  if (!context) throw new Error('SelectionProvider is required.');
  return context;
}
