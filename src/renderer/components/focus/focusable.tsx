import { cloneElement, useEffect, useRef } from 'react';

import { useFocus } from './focusContext';

interface FocusableProps {
  id: string;
  children: React.ReactElement;
  scope?: string;
}

export default function Focusable({id, children, scope}: FocusableProps) {
  const ref = useRef<HTMLElement>(null);
  const { register, unregister } = useFocus();

  useEffect(() => {
    register({
      id,
      ref,
      scope
    });

    return () => {
      unregister(id);
    };
  }, [id, register, unregister, scope]);

  return cloneElement(children, {
    ref,
    tabIndex: 0,
  });
}