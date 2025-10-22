import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  analyserNode: AnalyserNode | null;
  isActive: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyserNode, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyserNode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    let animationFrameId: number;

    analyserNode.fftSize = 2048;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);
      
      if (!canvasCtx) return;

      analyserNode.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = '#0a0a0a'; // primary-background
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#4285F4'; // accent-primary
      canvasCtx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    if (isActive) {
      draw();
    } else if(canvasCtx) {
       canvasCtx.fillStyle = '#0a0a0a';
       canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [analyserNode, isActive]);

  return <canvas ref={canvasRef} width="600" height="100" className="w-full h-24 rounded-lg" />;
};

export default AudioVisualizer;