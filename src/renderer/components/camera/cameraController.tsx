import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ReverseCameraController() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentLocation = useRef(
    location.pathname + location.search + location.hash,
  );

  const previousLocation = useRef('/');
  const cameraActive = useRef(false);

  useEffect(() => {
    currentLocation.current =
      location.pathname + location.search + location.hash;
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    let mounted = true;

    const handleReverseChange = (isReversing: boolean) => {
      if (!mounted) {
        return;
      }

      if (isReversing && !cameraActive.current) {
        previousLocation.current = currentLocation.current;

        cameraActive.current = true;

        navigate('/camera');
        return;
      }

      if (!isReversing && cameraActive.current) {
        cameraActive.current = false;

        navigate(previousLocation.current, {
          replace: true,
        });

        previousLocation.current = '/';
      }
    };

    const unsubscribe = window.electron.ipcRenderer.on(
      'reverse-changed',
      (value) => {
        handleReverseChange(Boolean(value));
      },
    );

    // Handle the case where the app starts
    // while the car is already in reverse.
    window.electron.ipcRenderer
      .invoke('reverse-state', [])
      .then((value) => {
        if (mounted) {
          handleReverseChange(Boolean(value));
        }
      })
      .catch((error) => {
        console.error('Failed to get reverse state:', error);
      });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [navigate]);

  return null;
}
