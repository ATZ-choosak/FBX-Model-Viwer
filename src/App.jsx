import {
  Environment,
  OrbitControls,
  Stage,
  useFBX,
  useProgress,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useRef } from "react";
import "./App.css";
import { motion, AnimatePresence } from "framer-motion";

const Model = () => {
  const groupRef = useRef();
  const fbx = useFBX("fbx_model.fbx");

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <primitive position={[0, 0, 0]} object={fbx} />;
      </mesh>
    </group>
  );
};

const LoadingFallback = () => {
  const { progress } = useProgress();

  return (
    <div className="absolute w-full h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: progress > 50 ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-black text-2xl font-bold animate-pulse">
          {progress.toFixed(0)}%
        </p>
      </motion.div>
    </div>
  );
};

function App() {
  return (
    <div className="absolute w-full h-full ">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas>
          <Stage
            contactShadow
            shadows
            adjustCamera
            environment="city"
            preset="rembrandt"
          >
            <Model />
            <OrbitControls enableZoom={true} enablePan={false} />
          </Stage>
          <Environment files="environment.hdr" background />
          <ambientLight intensity={2} />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default App;
