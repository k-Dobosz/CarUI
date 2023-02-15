import { RefObject, useEffect, useRef } from 'react';

type VisualizerProps = {
  audioRef: RefObject<HTMLAudioElement>;
};

export default function Visualization({ audioRef }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let animation: number;

  useEffect(() => {
    if (!canvasRef.current) return undefined;
    if (!audioRef.current) return undefined;

    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioRef.current);
    const ctx = canvasRef.current.getContext('2d');
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    function renderAnimation() {
      const freqData = new Uint8Array(analyser.frequencyBinCount);

      analyser.getByteFrequencyData(freqData);

      if (!ctx) return;
      if (!canvasRef.current) return;

      ctx.clearRect(0, 0, canvasRef.current?.width, canvasRef.current?.height);
      ctx.fillStyle = '#fff';

      for (let i = 0; i < freqData.length; i += 1) {
        const magnitude = freqData[i];
        ctx.fillRect(
          i * 4,
          canvasRef.current?.height - magnitude / 2,
          3,
          -magnitude
        );
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
      animation = requestAnimationFrame(renderAnimation);
    }

    renderAnimation();

    return () => {
      cancelAnimationFrame(animation);
      analyser.disconnect();
      source.disconnect();
    };
  }, [audioRef, canvasRef]);

  return <canvas ref={canvasRef} id="visualization" />;
}
