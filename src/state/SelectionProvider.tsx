import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { artworks } from '../catalog';
import { SelectionContext } from './selection';

const STORAGE_KEY = 'artseoul:selection:v1';
const validIds = new Set(artworks.map((artwork) => artwork.id));

function readSelection(): string[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? '[]',
    );
    if (!Array.isArray(value)) return [];
    return [
      ...new Set(
        value.filter(
          (id): id is string => typeof id === 'string' && validIds.has(id),
        ),
      ),
    ];
  } catch {
    return [];
  }
}

export default function SelectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [ids, setIds] = useState<string[]>(readSelection);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Private browsing and a full storage quota must not prevent selection.
    }
  }, [ids]);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null)
        setIds(readSelection());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const value = useMemo(
    () => ({
      ids,
      toggle: (id: string) => {
        if (validIds.has(id)) {
          setIds((current) =>
            current.includes(id)
              ? current.filter((value) => value !== id)
              : [...current, id],
          );
        }
      },
      clear: () => setIds([]),
    }),
    [ids],
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}
