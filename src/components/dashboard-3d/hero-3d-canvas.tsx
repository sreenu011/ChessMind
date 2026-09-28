import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Chessboard3D } from "./chessboard-3d";

interface Hero3DCanvasProps {
  isMobile: boolean;
  onCreated: () => void;
}

export function Hero3DCanvas({ isMobile, onCreated }: Hero3DCanvasProps) {
  useEffect(() => {
    // Notify parent component that 3D canvas has mounted
    const timer = setTimeout(onCreated, 50);
    return () => clearTimeout(timer);
  }, [onCreated]);

  return (
    <div className="relative w-full h-full">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          alpha: true,
          failIfMajorPerformanceCaveat: false,
        }}
        shadows={false}
      >
        <PerspectiveCamera makeDefault position={[0, 4.5, 7.5]} fov={isMobile ? 50 : 42} />

        {/* Cinematic Optimized Lighting System */}
        <ambientLight intensity={0.7} color="#fef3c7" />
        <directionalLight position={[5, 8, 5]} intensity={1.2} color="#fef3c7" />
        <pointLight position={[-6, 4, -4]} intensity={0.9} color="#d97706" />
        <pointLight position={[6, 3, 4]} intensity={0.5} color="#10b981" />

        {/* 3D Chessboard */}
        <Chessboard3D isMobile={isMobile} />

        {/* Non-interactive camera controls */}
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>

      {/* Decorative Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
    </div>
  );
}
