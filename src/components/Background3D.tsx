"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
}

interface Orb {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  hue: number;
  speed: number;
  pulsePhase: number;
}

export function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const orbsRef = useRef<Orb[]>([]);
  const [mounted, setMounted] = useState(false);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        hue: Math.random() * 60 + 270,
        life: Math.random() * 100,
      });
    }
    particlesRef.current = particles;

    const orbs: Orb[] = [];
    for (let i = 0; i < 5; i++) {
      orbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: Math.random() * width,
        targetY: Math.random() * height,
        radius: Math.random() * 150 + 80,
        hue: [280, 320, 260, 300, 340][i],
        speed: 0.003 + Math.random() * 0.004,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    orbsRef.current = orbs;
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) {
        initParticles(canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    let animId: number;
    const animate = () => {
      frameRef.current++;
      const t = frameRef.current * 0.01;
      const w = canvas.width;
      const h = canvas.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, w, h);

      // Dark gradient base
      const bgGrad = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.5, h * 0.5, w * 0.8);
      bgGrad.addColorStop(0, "#1a0a2e");
      bgGrad.addColorStop(0.5, "#0f0518");
      bgGrad.addColorStop(1, "#050208");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Animated mesh gradient blobs
      const blobCount = 4;
      for (let i = 0; i < blobCount; i++) {
        const angle = t * 0.3 + (i * Math.PI * 2) / blobCount;
        const bx = w * 0.5 + Math.cos(angle) * w * 0.25 + Math.sin(t + i) * 50;
        const by = h * 0.5 + Math.sin(angle) * h * 0.2 + Math.cos(t * 0.7 + i) * 40;
        const blobGrad = ctx.createRadialGradient(bx, by, 0, bx, by, 200 + Math.sin(t + i) * 50);
        const hues = [280, 320, 260, 300];
        blobGrad.addColorStop(0, `hsla(${hues[i]}, 80%, 50%, 0.12)`);
        blobGrad.addColorStop(0.5, `hsla(${hues[i]}, 80%, 40%, 0.05)`);
        blobGrad.addColorStop(1, "transparent");
        ctx.fillStyle = blobGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // Mouse-reactive glow
      if (mx > 0 && my > 0) {
        const mouseGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 300);
        mouseGrad.addColorStop(0, "rgba(168, 85, 247, 0.08)");
        mouseGrad.addColorStop(0.5, "rgba(236, 72, 153, 0.04)");
        mouseGrad.addColorStop(1, "transparent");
        ctx.fillStyle = mouseGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // Floating orbs
      orbsRef.current.forEach((orb) => {
        orb.x += (orb.targetX - orb.x) * orb.speed;
        orb.y += (orb.targetY - orb.y) * orb.speed;

        if (Math.abs(orb.x - orb.targetX) < 10) {
          orb.targetX = Math.random() * w;
          orb.targetY = Math.random() * h;
        }

        const pulse = Math.sin(t * 2 + orb.pulsePhase) * 0.3 + 0.7;
        const distToMouse = Math.sqrt((orb.x - mx) ** 2 + (orb.y - my) ** 2);
        const mouseInfluence = Math.max(0, 1 - distToMouse / 400);

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius * pulse);
        grad.addColorStop(0, `hsla(${orb.hue}, 80%, 60%, ${0.15 + mouseInfluence * 0.1})`);
        grad.addColorStop(0.4, `hsla(${orb.hue}, 70%, 50%, ${0.08 + mouseInfluence * 0.05})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Orb ring
        ctx.strokeStyle = `hsla(${orb.hue}, 70%, 60%, ${0.1 + mouseInfluence * 0.15})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * pulse * 0.7, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.5;

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150;
          p.vx += (dx / dist) * force * 0.3;
          p.vy += (dy / dist) * force * 0.3;
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Wrap around
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const flicker = Math.sin(p.life * 0.1) * 0.3 + 0.7;
        ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${p.opacity * flicker})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        ctx.shadowColor = `hsla(${p.hue}, 80%, 60%, 0.5)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Connection lines between nearby particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i];
          const b = particlesRef.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = `rgba(168, 130, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Twinkling stars
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137.5 + t * 2) % w);
        const sy = ((i * 97.3 + Math.sin(t * 0.5 + i) * 20) % h);
        const twinkle = Math.sin(t * 3 + i * 2.1) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.4})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 1 + twinkle, 0, Math.PI * 2);
        ctx.fill();
      }

      // Subtle grid lines
      ctx.strokeStyle = "rgba(168, 85, 247, 0.03)";
      ctx.lineWidth = 0.5;
      const gridSize = 80;
      const offsetY = (t * 10) % gridSize;
      for (let y = -gridSize + offsetY; y < h + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [mounted, initParticles]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
