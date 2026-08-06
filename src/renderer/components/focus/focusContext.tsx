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
}

interface FocusContextType {
  register: (item: FocusItem) => void;
  unregister: (id: string) => void;
  setFocus: (id: string) => void;
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
    setCurrent(0);
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
    const currentElement = items[current]?.ref.current;

    if (!currentElement) {
      return current;
    }

    const currentPos = getCenter(currentElement);
    const candidates = items.filter((_, index) => index !== current);

    let best = null as {
      index: number;
      distance: number;
    } | null;

    for (let i = 0; i < candidates.length; i++) {
      const element = candidates[i].ref.current;

      if (!element) {
        continue;
      }

      const pos = getCenter(element);
      const dx = pos.x - currentPos.x;
      const dy = pos.y - currentPos.y;
      let valid = false;

      switch (direction) {
        case 'up':
          valid = dy < -10;
          break;

        case 'down':
          valid = dy > 10;
          break;

        case 'left':
          valid = dx < -10;
          break;

        case 'right':
          valid = dx > 10;
          break;
      }

      if (!valid) {
        continue;
      }

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (!best || distance < best.distance) {
        best = {
          index: i,
          distance,
        };
      }
    }

    return best ? items.indexOf(candidates[best.index]) : current;
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!items.length) {
        return;
      }

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

        case 'Enter':
        case ' ':
          items[current]?.ref.current?.click();

          return;

        default:
          return;
      }

      event.preventDefault();
      setCurrent(next);

      items[next]?.ref.current?.focus();
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