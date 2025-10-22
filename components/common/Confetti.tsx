
import React, { useEffect, useRef } from 'react';

const COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
const PARTICLE_COUNT = 150;
const DURATION = 3000; // ms

interface Particle {
  x: number;
  y: number;
  r: number; // radius
  dx: number; // x velocity
  dy: number; // y velocity
  color: string;
  tilt: number;
  tiltAngle: number;
}

const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const particles = useRef<Particle[]>([]);
  const startTime = useRef<number>(Date.now());

  const createParticles = (width: number, height: number) => {
    particles.current = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.current.push({
        x: width * 0.5,
        y: height * 1.1,
        r: Math.random() * 6 + 4,
        dx: Math.random() * 20 - 10,
        dy: Math.random() * -18 - 12,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngle: 0,
      });
    }
  };

  const updateAndDrawParticles = (ctx: CanvasRenderingContext2D, width: number, height: number, elapsed: number) => {
    ctx.clearRect(0, 0, width, height);

    particles.current.forEach((p, i) => {
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.25; // gravity
      p.tiltAngle += p.tilt * 0.03;
      
      ctx.beginPath();
      ctx.lineWidth = p.r / 2;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
      ctx.stroke();

      // Remove particle if it's off-screen
      if (p.y > height * 1.2) {
        particles.current.splice(i, 1);
      }
    });
  };
  
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const elapsed = Date.now() - startTime.current;

    updateAndDrawParticles(ctx, canvas.width, canvas.height, elapsed);

    if (elapsed < DURATION) {
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
       if(particles.current.length > 0) {
           animationFrameId.current = requestAnimationFrame(animate);
       }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createParticles(canvas.width, canvas.height);
    startTime.current = Date.now();
    animate();

    const handleResize = () => {
        if(canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if(animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
      style={{ zIndex: 9999 }}
    />
  );
};

export default Confetti;
