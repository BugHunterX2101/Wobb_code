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
  rotation: number;
  rotationSpeed: number;
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
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        hue: Math.random() * 60 + 270,
        life: Math.random() * 100,
      });
    }
    particlesRef.current = particles;

    const orbs: Orb[] = [];
    for (let i = 0; i < 6; i++) {
      orbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: Math.random() * width,
        targetY: Math.random() * height,
        radius: Math.random() * 180 + 100,
        hue: [280, 320, 260, 300, 340, 270][i],
        speed: 0.002 + Math.random() * 0.003,
        pulsePhase: Math.random() * Math.PI * 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.5,
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

      // Dark base
      const bgGrad = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.5, h * 0.5, w * 0.9);
      bgGrad.addColorStop(0, "#1a0a2e");
      bgGrad.addColorStop(0.3, "#0f0518");
      bgGrad.addColorStop(0.7, "#080310");
      bgGrad.addColorStop(1, "#020104");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // --- Animated mesh gradient blobs ---
      const blobCount = 6;
      for (let i = 0; i < blobCount; i++) {
        const angle = t * 0.2 + (i * Math.PI * 2) / blobCount;
        const bx = w * 0.5 + Math.cos(angle) * w * 0.3 + Math.sin(t * 0.7 + i * 1.2) * 60;
        const by = h * 0.5 + Math.sin(angle) * h * 0.25 + Math.cos(t * 0.5 + i * 0.8) * 50;
        const rad = 220 + Math.sin(t + i * 1.5) * 60;
        const blobGrad = ctx.createRadialGradient(bx, by, 0, bx, by, rad);
        const hues = [280, 320, 260, 300, 340, 270];
        const alpha = 0.08 + Math.sin(t * 0.3 + i) * 0.03;
        blobGrad.addColorStop(0, `hsla(${hues[i]}, 80%, 55%, ${alpha})`);
        blobGrad.addColorStop(0.4, `hsla(${hues[i]}, 70%, 40%, ${alpha * 0.5})`);
        blobGrad.addColorStop(1, "transparent");
        ctx.fillStyle = blobGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // --- Mouse-reactive glow ---
      if (mx > 0 && my > 0) {
        const mouseGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 350);
        mouseGrad.addColorStop(0, "rgba(168, 85, 247, 0.1)");
        mouseGrad.addColorStop(0.3, "rgba(236, 72, 153, 0.06)");
        mouseGrad.addColorStop(0.6, "rgba(147, 51, 234, 0.03)");
        mouseGrad.addColorStop(1, "transparent");
        ctx.fillStyle = mouseGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // --- Floating orbs with rings ---
      orbsRef.current.forEach((orb) => {
        orb.x += (orb.targetX - orb.x) * orb.speed;
        orb.y += (orb.targetY - orb.y) * orb.speed;
        orb.rotation += orb.rotationSpeed;

        if (Math.abs(orb.x - orb.targetX) < 15) {
          orb.targetX = Math.random() * w;
          orb.targetY = Math.random() * h;
        }

        const pulse = Math.sin(t * 1.5 + orb.pulsePhase) * 0.25 + 0.75;
        const distToMouse = Math.sqrt((orb.x - mx) ** 2 + (orb.y - my) ** 2);
        const mouseInfluence = Math.max(0, 1 - distToMouse / 350);

        // Glow
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius * pulse);
        grad.addColorStop(0, `hsla(${orb.hue}, 85%, 65%, ${0.12 + mouseInfluence * 0.12})`);
        grad.addColorStop(0.3, `hsla(${orb.hue}, 75%, 50%, ${0.06 + mouseInfluence * 0.06})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Orb ring
        ctx.save();
        ctx.translate(orb.x, orb.y);
        ctx.rotate((orb.rotation * Math.PI) / 180);
        ctx.strokeStyle = `hsla(${orb.hue}, 70%, 65%, ${0.08 + mouseInfluence * 0.15})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, orb.radius * pulse * 0.6, 0, Math.PI * 2);
        ctx.stroke();

        // Secondary ring
        ctx.strokeStyle = `hsla(${orb.hue + 20}, 70%, 60%, ${0.04 + mouseInfluence * 0.08})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(0, 0, orb.radius * pulse * 0.85, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // --- Particles ---
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.5;

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 0) {
          const force = (180 - dist) / 180;
          p.vx += (dx / dist) * force * 0.4;
          p.vy += (dy / dist) * force * 0.4;
        }

        // Gravity toward center (subtle)
        const cx = w / 2 - p.x;
        const cy = h / 2 - p.y;
        const cd = Math.sqrt(cx * cx + cy * cy);
        if (cd > 0) {
          p.vx += (cx / cd) * 0.01;
          p.vy += (cy / cd) * 0.01;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const flicker = Math.sin(p.life * 0.08) * 0.3 + 0.7;
        ctx.save();
        ctx.shadowColor = `hsla(${p.hue}, 80%, 60%, 0.6)`;
        ctx.shadowBlur = 10;
        ctx.fillStyle = `hsla(${p.hue}, 70%, 75%, ${p.opacity * flicker})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // --- Connection lines ---
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i];
          const b = particlesRef.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.2;
            ctx.strokeStyle = `rgba(168, 130, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // --- Twinkling stars ---
      for (let i = 0; i < 60; i++) {
        const seed = i * 137.5;
        const sx = ((seed + t * 1.5 * (1 + (i % 3) * 0.3)) % w);
        const sy = ((seed * 0.7 + Math.sin(t * 0.4 + i * 1.7) * 30) % h);
        const twinkle = Math.sin(t * 2.5 + i * 2.1) * 0.5 + 0.5;
        const starSize = 0.8 + twinkle * 1.2;
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.5})`;
        ctx.beginPath();
        ctx.arc(sx, sy, starSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Shooting stars ---
      const shootingStarPhase = (t * 0.1) % 1;
      if (shootingStarPhase < 0.08) {
        const ssx = (shootingStarPhase * 10 * w) % w;
        const ssy = (shootingStarPhase * 6 * h * 0.3) % (h * 0.4);
        const tailLen = 60;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ssx, ssy);
        ctx.lineTo(ssx - tailLen, ssy - tailLen * 0.6);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ssx, ssy);
        ctx.lineTo(ssx - tailLen * 1.5, ssy - tailLen * 0.9);
        ctx.stroke();
      }

      // --- Subtle grid lines (perspective-style) ---
      ctx.strokeStyle = "rgba(168, 85, 247, 0.02)";
      ctx.lineWidth = 0.5;
      const gridSize = 80;
      const offsetY = (t * 8) % gridSize;
      for (let y = -gridSize + offsetY; y < h + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let x = 0; x < w; x += gridSize) {
        const alpha = 0.01 + Math.sin(t + x * 0.01) * 0.01;
        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
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
