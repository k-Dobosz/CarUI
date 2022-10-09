import { useState, useEffect } from 'react';
import './clock.css';

export default function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const changeTime = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(changeTime);
  });

  return <p> {time} </p>;
}
