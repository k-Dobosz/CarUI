import { useEffect, useState } from 'react';

import './clock.scss';

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface ClockProps {
  className?: string;
}

export default function Clock({ className = '' }: ClockProps) {
  const [time, setTime] = useState(getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTime());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <span className={`clock ${className}`}>{time}</span>;
}
