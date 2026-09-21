import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CameraRoute() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useNavigate();

  const stopCamera = () => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    try {
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: 'environment',
          },
          width: {
            ideal: 1920,
          },
          height: {
            ideal: 1080,
          },
          frameRate: {
            ideal: 30,
            max: 60,
          },
        },
        audio: false,
      });

      streamRef.current = stream;

      const video = videoRef.current;

      if (!video) {
        return;
      }

      video.srcObject = stream;
      await video.play();
    } catch (error) {
      console.error('Reverse camera failed:', error);

      reconnectTimer.current = setTimeout(() => {
        startCamera();
      }, 2000);
    }
  };

  useEffect(() => {
    startCamera();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' || event.key === 'Escape') {
        event.preventDefault();

        stopCamera();
        navigate(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopCamera();
    };
  }, [navigate]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'black',
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          background: 'black',
        }}
      />
    </div>
  );
}
