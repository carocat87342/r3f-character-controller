/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

export function Terrain(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/jungle-merged.glb') as any;

  useEffect(() => {
    for (const material in materials) {
      materials[material].envMapIntensity = 0.3;
      materials[material].normalMap = null;
    }
  }, [materials]);

  return (
    <group {...props} dispose={null}>
      <group position={[-0.0473287, -2.02306247, -0.05932176]} scale={0.0254} userData={{ name: 'Level' }}>
        <mesh castShadow receiveShadow geometry={nodes.Mesh725.geometry} material={materials['Material #34']} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh725_1.geometry} material={materials['Material #38']} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh725_2.geometry} material={materials['Material #25']} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh725_3.geometry} material={materials['Material #39']} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh725_4.geometry} material={materials['Material #31']} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh725_5.geometry} material={materials['Material #311']} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh725_6.geometry} material={materials['Material #41']} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh725_7.geometry} material={materials['Material #37']} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh725_8.geometry} material={materials['Material #36']} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh725_9.geometry} material={materials['Material #42']} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh725_10.geometry} material={materials['Material #44']} />
      </group>
    </group>
  );
}

useGLTF.preload('/jungle-merged.glb');
