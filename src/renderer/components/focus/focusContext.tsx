import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface FocusItem {
  id: string;
  ref: React.RefObject<HTMLElement>;
  row?: number;
  col?: number;
  scope?: string;
}

interface FocusContextType {
  register: (item: FocusItem) => void;
  unregister: (id: string) => void;
  setFocus: (id: string) => void;
  switchScope: (direction: 'next' | 'previous') => void;
}

const FocusContext = createContext<FocusContextType | null>(null);

export function FocusProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FocusItem[]>([]);
  const [current, setCurrent] = useState(0);

  const register = useCallback((item: FocusItem) => {
    setItems((prev) => {
      const exists = prev.find((x) => x.id === item.id);

      if (exists) {
        return prev.map((x) => (x.id === item.id ? item : x));
      }

      return [...prev, item];
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const setFocus = useCallback(
    (id: string) => {
      const index = items.findIndex((item) => item.id === id);

      if (index !== -1) {
        setCurrent(index);
        items[index].ref.current?.focus();
      }
    },
    [items],
  );

  const getCenter = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();

    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  const findNext = (direction: 'up' | 'down' | 'left' | 'right') => {
    const currentItem = items[current];
    const currentElement = currentItem?.ref.current;

    if (!currentElement) return current;

    const currentPos = getCenter(currentElement);

    const findCandidate = (sameScope: boolean) => {
      const candidates = items
        .map((item, index) => ({ item, index }))
        .filter(({ item, index }) => {
          if (index === current || !item.ref.current) {
            return false;
          }

          return sameScope
            ? item.scope === currentItem.scope
            : item.scope !== currentItem.scope;
        });

      let best: { index: number; distance: number } | null = null;

      for (const candidate of candidates) {
        const element = candidate.item.ref.current;

        if (!element) continue;

        const pos = getCenter(element);
        const dx = pos.x - currentPos.x;
        const dy = pos.y - currentPos.y;

        let valid = false;
        let primaryDistance = 0;
        let secondaryDistance = 0;

        switch (direction) {
          case 'up':
            valid = dy < -10;
            primaryDistance = Math.abs(dy);
            secondaryDistance = Math.abs(dx);
            break;

          case 'down':
            valid = dy > 10;
            primaryDistance = Math.abs(dy);
            secondaryDistance = Math.abs(dx);
            break;

          case 'left':
            valid = dx < -10;
            primaryDistance = Math.abs(dx);
            secondaryDistance = Math.abs(dy);
            break;

          case 'right':
            valid = dx > 10;
            primaryDistance = Math.abs(dx);
            secondaryDistance = Math.abs(dy);
            break;
        }

        if (!valid) continue;

        // Prefer candidates aligned with the current item.
        const distance = primaryDistance + secondaryDistance * 2;

        if (!best || distance < best.distance) {
          best = {
            index: candidate.index,
            distance,
          };
        }
      }

      return best?.index ?? null;
    };

    // First search within the current scope.
    const sameScopeResult = findCandidate(true);

    if (sameScopeResult !== null) {
      return sameScopeResult;
    }

    // If no item exists in that direction, search other scopes.
    const otherScopeResult = findCandidate(false);

    return otherScopeResult ?? current;
  };

  const switchScope = useCallback(
    (direction: 'next' | 'previous') => {
      const scopes = [...new Set(items.map((item) => item.scope))];

      const currentScope = items[current]?.scope;
      const currentScopeIndex = scopes.indexOf(currentScope);

      if (currentScopeIndex === -1 || scopes.length < 2) return;

      const nextScopeIndex =
        direction === 'next'
          ? (currentScopeIndex + 1) % scopes.length
          : (currentScopeIndex - 1 + scopes.length) % scopes.length;

      const nextScope = scopes[nextScopeIndex];

      const target = items.findIndex((item) => item.scope === nextScope);

      if (target !== -1) {
        setCurrent(target);
        items[target].ref.current?.focus();
      }
    },
    [items, current],
  );

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!items.length) return;

      let next = current;

      switch (event.key) {
        case 'ArrowUp':
          next = findNext('up');
          break;

        case 'ArrowDown':
          next = findNext('down');
          break;

        case 'ArrowLeft':
          next = findNext('left');
          break;

        case 'ArrowRight':
          next = findNext('right');
          break;

        case 'Tab':
          return;

        case 'Enter':
        case ' ':
          if (document.activeElement === items[current]?.ref.current) {
            items[current]?.ref.current?.click();
          }
          return;

        default:
          return;
      }

      event.preventDefault();

      if (next !== current) {
        setCurrent(next);
        items[next]?.ref.current?.focus();
      }
    };

    window.addEventListener('keydown', handler);

    return () => window.removeEventListener('keydown', handler);
  }, [items, current]);

  useEffect(() => {
    if (current >= items.length) {
      setCurrent(0);
    }
  }, [items, current]);

  return (
    <FocusContext.Provider
      value={{
        register,
        unregister,
        setFocus,
        switchScope,
      }}
    >
      {children}
    </FocusContext.Provider>
  );
}

export function useFocus() {
  const context = useContext(FocusContext);

  if (!context) {
    throw new Error('useFocus must be used inside FocusProvider');
  }

  return context;
}
