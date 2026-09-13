import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CameraRoute() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const reconnectTimer = useRef(null);
  const navigate = useNavigate();

  const [cameraReady, setCameraReady] = useState(false);

  async function startCamera() {
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

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play();

        setCameraReady(true);
      }
    } catch (err) {
      console.error('Reverse camera failed:', err);

      setCameraReady(false);

      reconnectTimer.current = setTimeout(() => {
        startCamera();
      }, 2000);
    }
  }


  function stopCamera() {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach(track => track.stop());

      streamRef.current = null;
    }
  }


  useEffect(() => {
    startCamera();

    function handleKeyDown(event) {
      if (event.key === 'Backspace' || event.key === 'Escape') {
        event.preventDefault();

        stopCamera();
        navigate(-1);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(reconnectTimer.current);
      window.removeEventListener('keydown', handleKeyDown);
      stopCamera();
    };
  }, []);

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
          transform: 'none',
          background: 'black',
        }}
      />

      {!cameraReady && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 24,
          }}
        >
          Camera unavailable
        </div>
      )}
    </div>
  );
}