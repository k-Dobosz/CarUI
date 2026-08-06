import { cloneElement, useEffect, useRef } from 'react';

import { useFocus } from './focusContext';

interface FocusableProps {
  id: string;
  children: React.ReactElement;
}

export default function Focusable({ id, children }: FocusableProps) {
  const ref = useRef<HTMLElement>(null);
  const { register, unregister } = useFocus();

  useEffect(() => {
    register({
      id,
      ref,
    });

    return () => {
      unregister(id);
    };
  }, [id, register, unregister]);

  return cloneElement(children, {
    ref,
    tabIndex: 0,
  });
}
