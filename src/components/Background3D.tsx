"use client";

import { Suspense, useEffect, useState, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

type Vec3 = [number, number, number];

const PlatformOrb = ({ position, color, emoji, delay = 0 }: { position: Vec3; color: string; emoji: string; delay?: number }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const { viewport } = useThree();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(viewport.width < 768);
  }, [viewport.width]);

  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5 + delay) * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.8 + delay) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh>
          <sphereGeometry args={[isMobile ? 1.2 : 1.8, 32, 32]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0}
            roughness={0.1}
            transmission={0.3}
            thickness={0.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
            ior={1.5}
          />
        </mesh>
      </Float>
      <Html transform position={[0, isMobile ? -2.5 : -3.2, 0] as Vec3} center style={{ fontSize: isMobile ? "3rem" : "4.5rem", filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.2))", userSelect: "none", pointerEvents: "none" }}>
        {emoji}
      </Html>
      <Html transform position={[0, isMobile ? 2.8 : 3.5, 0] as Vec3} center style={{ fontSize: isMobile ? "0.7rem" : "0.9rem", fontWeight: 600, color: "#ffffff", textShadow: "0 2px 10px rgba(0,0,0,0.5)", whiteSpace: "nowrap", userSelect: "none", pointerEvents: "none" }}>
        {emoji === "📷" && "Instagram"}
        {emoji === "▶️" && "YouTube"}
        {emoji === "🎵" && "TikTok"}
      </Html>
    </group>
  );
};

const FloatingShapes = () => {
  const { viewport } = useThree();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(viewport.width < 768);
  }, [viewport.width]);

  const shapes: { position: Vec3; rotation: Vec3; scale: number; color: string }[] = [
    { position: [-8, 6, -10], rotation: [0.4, 0.6, 0.2], scale: 0.8, color: "#c026d3" },
    { position: [-10, -2, -5], rotation: [0.7, 0.3, 0.5], scale: 1.6, color: "#f9a8d4" },
    { position: [8, 4, -8], rotation: [0.2, 0.8, 0.1], scale: 1, color: "#ec4899" },
    { position: [10, -4, -6], rotation: [0.5, 0.1, 0.6], scale: 1.3, color: "#f472b6" },
  ];

  const scaledShapes = shapes.map((s) => ({
    ...s,
    scale: s.scale * (isMobile ? 0.5 : 1),
  }));

  return (
    <group>
      {scaledShapes.map((shape, i) => (
        <Float key={i} speed={0.8 + i * 0.15} rotationIntensity={0.4} floatIntensity={0.8}>
          <mesh position={shape.position} rotation={shape.rotation} scale={shape.scale}>
            <torusGeometry args={[1, 0.3, 16, 32]} />
            <meshPhysicalMaterial
              color={shape.color}
              metalness={0}
              roughness={0.2}
              transmission={0.4}
              thickness={0.3}
              clearcoat={1}
              clearcoatRoughness={0.1}
              ior={1.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const FloatingHearts = () => {
  const { viewport } = useThree();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(viewport.width < 768);
  }, [viewport.width]);

  const hearts = useMemo(() =>
    Array.from({ length: isMobile ? 12 : 20 }, () => ({
      x: (Math.random() - 0.5) * (isMobile ? 25 : 30),
      y: (Math.random() - 0.5) * (isMobile ? 18 : 22),
      z: (Math.random() - 0.5) * (isMobile ? 20 : 25),
      scale: Math.random() * (isMobile ? 0.4 : 0.6) + (isMobile ? 0.15 : 0.2),
      speed: Math.random() * 0.5 + 0.3,
      delay: Math.random() * Math.PI * 2,
      color: ["#f472b6", "#ec4899", "#a855f7", "#db2777", "#c026d3"][Math.floor(Math.random() * 5)],
    })),
    [isMobile]
  );

  return (
    <group>
      {hearts.map((heart, i) => (
        <Float key={i} speed={heart.speed} rotationIntensity={0.2} floatIntensity={1}>
          <Html transform position={[heart.x, heart.y + Math.sin(heart.delay), heart.z] as Vec3} center style={{ fontSize: `${heart.scale * (isMobile ? 1.5 : 2)}rem`, opacity: 0.7, filter: `drop-shadow(0 4px 15px ${heart.color}80)`, userSelect: "none", pointerEvents: "none" }}>
            ♡
          </Html>
        </Float>
      ))}
    </group>
  );
};

const Sparkles = () => {
  const { viewport } = useThree();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(viewport.width < 768);
  }, [viewport.width]);

  const sparkles = useMemo(() =>
    Array.from({ length: isMobile ? 25 : 40 }, () => ({
      x: (Math.random() - 0.5) * (isMobile ? 35 : 40),
      y: (Math.random() - 0.5) * (isMobile ? 25 : 30),
      z: (Math.random() - 0.5) * (isMobile ? 30 : 35),
      size: Math.random() * (isMobile ? 0.06 : 0.08) + (isMobile ? 0.02 : 0.03),
      color: Math.random() > 0.6 ? "#ffffff" : Math.random() > 0.3 ? "#fce7f3" : "#fbcfe8",
    })),
    [isMobile]
  );

  return (
    <group>
      {sparkles.map((sparkle, i) => (
        <mesh key={i} position={[sparkle.x, sparkle.y, sparkle.z] as Vec3}>
          <sphereGeometry args={[sparkle.size, 8, 8]} />
          <meshBasicMaterial color={sparkle.color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
};

const Scene = () => {
  const { viewport } = useThree();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(viewport.width < 768);
  }, [viewport.width]);

  return (
    <>
      <Stars radius={isMobile ? 80 : 100} factor={isMobile ? 150 : 250} saturation={0.8} />

      <ambientLight color="#ffffff" intensity={0.6} />
      <directionalLight position={[5, 10, 7]} color="#fce7f3" intensity={1.2} />
      <directionalLight position={[-5, 5, -5]} color="#fbcfe8" intensity={0.8} />
      <pointLight position={[0, 5, 5] as Vec3} color="#f472b6" intensity={0.5} decay={2} distance={30} />
      <pointLight position={[0, -5, -5] as Vec3} color="#a855f7" intensity={0.4} decay={2} distance={30} />

      <PlatformOrb position={[-4, 2, -6]} color="#e1306c" emoji="📷" delay={0} />
      <PlatformOrb position={[0, 0.5, -8]} color="#ff0000" emoji="▶️" delay={2} />
      <PlatformOrb position={[4, -1, -6]} color="#000000" emoji="🎵" delay={4} />

      <FloatingShapes />
      <FloatingHearts />
      <Sparkles />

      <Html transform position={[0, -8, -5] as Vec3} center style={{ fontSize: isMobile ? "1.1rem" : "1.4rem", fontWeight: 300, color: "rgba(255,255,255,0.7)", textAlign: "center", maxWidth: isMobile ? "280px" : "400px", lineHeight: 1.6, textShadow: "0 2px 20px rgba(225, 48, 108, 0.3)", userSelect: "none", pointerEvents: "none" }}>
        Discover & connect with top creators across platforms
      </Html>
    </>
  );
};

export function Background3D() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }} style={{ touchAction: "none" }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}