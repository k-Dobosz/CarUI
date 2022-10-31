import { RefObject, useEffect, useRef } from 'react';

type VisualiserProps = {
  audioRef: RefObject<HTMLAudioElement>;
};

export default function Visualization({ audioRef }: VisualiserProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return undefined;
    if (!audioRef.current) return undefined;

    console.log(audioRef);

    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioRef.current);
    const ctx = canvasRef.current.getContext('2d');
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    function render() {
      const freqData = new Uint8Array(analyser.frequencyBinCount);

      ctx?.clearRect(0, 0, 300, 150);
      ctx.fillStyle = '#fff';

      for (let i = 0; i < freqData.length; i += 1) {
        const magnitude = freqData[i];
        ctx?.fillRect(i * 4, 150, 2, -magnitude * 2);
      }
    }

    const animation = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animation);
      analyser.disconnect();
      source.disconnect();
    };
  }, [audioRef, canvasRef]);

  return <canvas ref={canvasRef} />;
}
