import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  angle: number;
  spinSpeed: number;
  isLeaf: boolean;
  color: string;
}

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Keep the particle canvas tied to the viewport.
    // This prevents particles from stretching when the page is very tall.
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Green color palette
    const colors = [
      "#10b981",
      "#059669",
      "#34d399",
      "#6ee7b7",
      "#14b8a6",
      "#047857",
    ];

    const particleCount = Math.min(
      Math.floor((width * height) / 18000),
      55,
    );

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 5 + 2,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: Math.random() * 0.7 + 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.02,
        isLeaf: Math.random() > 0.45,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const drawLeaf = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      angle: number,
      color: string,
      opacity: number,
    ) => {
      context.save();

      context.translate(x, y);
      context.rotate(angle);

      context.beginPath();

      // Organic petal / leaf curve
      context.moveTo(0, -size * 1.6);

      context.quadraticCurveTo(
        size * 1.1,
        -size * 0.4,
        0,
        size * 1.6,
      );

      context.quadraticCurveTo(
        -size * 1.1,
        -size * 0.4,
        0,
        -size * 1.6,
      );

      context.fillStyle = color;
      context.globalAlpha = opacity;
      context.fill();

      // Leaf center vein
      context.beginPath();
      context.moveTo(0, -size * 1.2);
      context.lineTo(0, size * 1.2);

      context.strokeStyle = "rgba(255, 255, 255, 0.4)";
      context.lineWidth = 0.8;
      context.stroke();

      context.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with faint green lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;

          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();

            ctx.moveTo(
              particles[i].x,
              particles[i].y,
            );

            ctx.lineTo(
              particles[j].x,
              particles[j].y,
            );

            ctx.strokeStyle = `rgba(16, 185, 129, ${
              0.12 * (1 - dist / 110)
            })`;

            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Interaction with mouse cursor
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;

        const mouseDist = Math.sqrt(
          dx * dx + dy * dy,
        );

        if (mouseDist < 120 && mouseDist > 0) {
          const force = (120 - mouseDist) / 120;

          p.x += (dx / mouseDist) * force * 2.5;
          p.y += (dy / mouseDist) * force * 2.5;
        }

        p.x +=
          p.speedX +
          Math.sin(p.angle) * 0.3;

        p.y += p.speedY;

        p.angle += p.spinSpeed;

        // Wrap around viewport boundaries
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        if (p.x > width + 20) {
          p.x = -20;
        }

        if (p.x < -20) {
          p.x = width + 20;
        }

        if (p.isLeaf) {
          drawLeaf(
            ctx,
            p.x,
            p.y,
            p.size,
            p.angle,
            p.color,
            p.opacity,
          );
        } else {
          // Soft glowing orb
          ctx.save();

          ctx.beginPath();

          ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2,
          );

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;

          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;

          ctx.fill();

          ctx.restore();
        }
      }

      animationFrameId =
        requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);

      window.removeEventListener(
        "resize",
        handleResize,
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove,
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="
        pointer-events-none
        fixed
        inset-0
        z-0
        h-screen
        w-screen
        opacity-70
      "
    />
  );
};
