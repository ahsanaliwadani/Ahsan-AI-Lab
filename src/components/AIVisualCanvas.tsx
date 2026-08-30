import React, { useEffect, useRef } from 'react';

export const AIVisualCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for abstract network visual
    const nodes: { x: number; y: number; vx: number; vy: number; radius: number; baseAlpha: number }[] = [];
    const nodeCount = Math.min(Math.floor((width * height) / 12000), 55);

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1.5,
        baseAlpha: Math.random() * 0.5 + 0.3
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Subtle background grid glow
      const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width * 0.7);
      grad.addColorStop(0, 'rgba(37, 99, 235, 0.12)');
      grad.addColorStop(0.5, 'rgba(34, 211, 238, 0.04)');
      grad.addColorStop(1, 'rgba(8, 17, 32, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Pulsing glow
        const pulse = Math.sin(time + i) * 0.3 + 0.7;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = i % 4 === 0 ? 'rgba(34, 211, 238, 0.85)' : 'rgba(59, 130, 246, 0.8)';
        ctx.shadowColor = i % 4 === 0 ? 'rgba(34, 211, 238, 0.8)' : 'rgba(37, 99, 235, 0.8)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Draw central geometric intelligence core
      const cx = width / 2;
      const cy = height / 2;
      const coreRadius = Math.min(width, height) * 0.22;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.2);

      // Outer dashed intelligence ring
      ctx.beginPath();
      ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
      ctx.setLineDash([8, 12]);
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Middle counter-rotating ring
      ctx.rotate(-time * 0.4);
      ctx.beginPath();
      ctx.arc(0, 0, coreRadius * 0.75, 0, Math.PI * 2);
      ctx.setLineDash([14, 8]);
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Hexagonal inner structure
      ctx.setLineDash([]);
      ctx.beginPath();
      for (let s = 0; s < 6; s++) {
        const angle = (s * Math.PI) / 3;
        const hx = Math.cos(angle) * (coreRadius * 0.45);
        const hy = Math.sin(angle) * (coreRadius * 0.45);
        if (s === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#081120]/80 border border-blue-900/30 ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#081120] via-transparent to-transparent opacity-80" />
    </div>
  );
};
