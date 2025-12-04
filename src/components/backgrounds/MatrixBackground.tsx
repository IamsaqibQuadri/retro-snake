import React, { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Authentic Matrix style: half-width katakana + numbers + symbols
    const matrixChars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$+-*/=%#&_';
    const chars = matrixChars.split('');

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    // Draw matrix rain
    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix green text
      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        // Reset drop to top randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black z-0">
      {/* Matrix rain canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0.8 }}
      />

      {/* Scanline effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)',
          animation: 'scanline 8s linear infinite',
        }}
      />

      {/* CRT screen curvature overlay */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
          boxShadow: 'inset 0 0 100px rgba(0, 255, 0, 0.1)',
        }}
      />

      {/* Green glow effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 255, 0, 0.05) 0%, transparent 70%)',
        }}
      />

      <style>{`
        @keyframes scanline {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default MatrixBackground;
