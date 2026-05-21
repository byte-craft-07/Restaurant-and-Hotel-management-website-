import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";

const Plate = () => {
  const plateRef = useRef(null);

  useFrame(({ pointer }) => {
    if (!plateRef.current) return;

    const targetRotationX = 0.08 + pointer.y * 0.24;
    const targetRotationY = -0.35 + pointer.x * 0.5;
    const targetPositionX = pointer.x * 0.22;
    const targetPositionZ = pointer.y * 0.12;

    plateRef.current.rotation.x +=
      (targetRotationX - plateRef.current.rotation.x) * 0.08;
    plateRef.current.rotation.y +=
      (targetRotationY - plateRef.current.rotation.y) * 0.08;
    plateRef.current.position.x +=
      (targetPositionX - plateRef.current.position.x) * 0.08;
    plateRef.current.position.z +=
      (targetPositionZ - plateRef.current.position.z) * 0.08;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <group ref={plateRef} rotation={[0.08, -0.35, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.2, 2.2, 0.18, 64]} />
          <meshStandardMaterial color="#ffffff" roughness={0.35} />
        </mesh>

        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.12, 64]} />
          <meshStandardMaterial color="#fb923c" roughness={0.4} />
        </mesh>

        <mesh position={[-0.7, 0.35, 0.2]} castShadow>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>

        <mesh position={[0.15, 0.38, -0.25]} castShadow>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>

        <mesh position={[0.75, 0.34, 0.2]} castShadow>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>

        <mesh position={[-0.25, 0.5, 0.55]} rotation={[0.4, 0.1, -0.3]}>
          <capsuleGeometry args={[0.09, 1.3, 8, 24]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.5} />
        </mesh>

        <mesh position={[0.4, 0.52, 0.5]} rotation={[0.45, -0.2, 0.25]}>
          <capsuleGeometry args={[0.08, 1.1, 8, 24]} />
          <meshStandardMaterial color="#166534" roughness={0.55} />
        </mesh>
      </group>
    </Float>
  );
};

const FloatingFoodScene = ({ className = "h-[420px] w-full lg:h-[540px]" }) => {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 3, 6], fov: 45 }} shadows>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <pointLight position={[-4, 3, 2]} intensity={1.1} color="#fed7aa" />

        <Plate />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
};

export default FloatingFoodScene;
