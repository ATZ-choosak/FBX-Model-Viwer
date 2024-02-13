import { OrbitControls, Stage, useFBX, useProgress } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useRef, useState } from "react";
import "./App.css";
import { motion } from "framer-motion";
import clsx from "clsx";
import { DoubleSide } from "three";

const Model = () => {
  const groupRef = useRef();
  const fbx = useFBX("fbx_model.fbx");

  if (fbx && fbx.children) {
    fbx.children.forEach((child) => {
      if (child.isMesh) {
        // Clone existing material
        const material = child.material.clone();
        // Disable backface culling
        material.side = DoubleSide;
        // Preserve texture mapping
        material.map = child.material.map;
        // Assign the new material
        child.material = material;
      }
    });
  }

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
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: progress >= 100 ? 0 : 1 }}
      transition={{ duration: 1 }}
      className="absolute w-full h-full flex items-center justify-center z-20 pointer-events-none"
    >
      <div className="w-36 space-y-3 flex flex-col justify-center items-center">
        <div>
          <img src="wise-logo.png" className="animate-pulse" />
        </div>
        <p className="font-bold text-sm text-white">Loading 3D model</p>
        <div className="relative h-2 w-full bg-gray-300 rounded-lg overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className={clsx("absolute left-0 top-0 h-full bg-yellow-500")}
          />
        </div>
      </div>
      <img
        className="fixed left-0 top-0 w-full h-full object-cover -z-10"
        src="bg_no_logo.png"
      />
    </motion.div>
  );
};

function App() {
  const [click, setClick] = useState(false);
  const [popup, setPopUp] = useState(false);

  return (
    <div className="absolute w-full h-full ">
      <LoadingFallback />
      <Suspense>
        <button
          onClick={() => setPopUp((pre) => !pre)}
          className="z-10 absolute right-5 top-5 cursor-pointer outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6 stroke-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
          <div
            className={clsx(
              "absolute rounded-tr-none bg-white right-8 top-5 rounded-md w-72 ease-in-out duration-[0.2s]",
              popup ? "opacity-100" : "opacity-0"
            )}
          >
            <ul className="list-disc pl-10 p-2 text-left text-sm">
              <li>Click and move the mouse to rotate the model.</li>
              <li>Scroll mouse to zoom.</li>
            </ul>
          </div>
        </button>
        <div className="w-full h-full absolute left-0 top-0 -z-10 pointer-events-none">
          <img src="bg_no_logo.png" className="w-full h-full object-cover" />
        </div>
        <Canvas
          onMouseUp={() => setClick(false)}
          onMouseDown={() => setClick(true)}
          className={clsx(click ? "cursor-grabbing" : "cursor-grab")}
          gl={{ antialias: false, alpha: true }}
        >
          <Stage
            contactShadow
            shadows
            adjustCamera
            environment="city"
            preset="rembrandt"
          >
            <Model />
            <OrbitControls enablePan={false} />
          </Stage>
          <ambientLight intensity={2} />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default App;
