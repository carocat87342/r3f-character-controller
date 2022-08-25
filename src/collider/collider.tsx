import React, { useEffect, useRef, useState } from 'react';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useCollider } from 'collider/stores/collider-store';
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
  MeshBVH,
  MeshBVHVisualizer,
  SAH,
} from 'three-mesh-bvh';
import * as THREE from 'three';
// @ts-ignore // Using our own SimplifyModifier to fix a bug.
import { SimplifyModifier } from './SimplifyModifier';
// import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier.js';

type ColliderProps = {
  children: React.ReactNode;
  debug?: { collider?: boolean; visualizer?: boolean };
  simplify?: number;
};

export function Collider({ children, debug = { collider: false, visualizer: false }, simplify }: ColliderProps) {
  const ref = useRef<THREE.Group>(null!);
  const [collider, setCollider] = useCollider((state) => [state.collider, state.setCollider]);
  const [visualizer, setVisualizer] = useState<MeshBVHVisualizer | undefined>(undefined);
  const init = useRef(true);

  useEffect(() => {
    if (!ref.current || !init.current) return;
    const geometries: THREE.BufferGeometry[] = [];

    // This is more imporant than it seems. We want to make sure our geometry is centered with the Box3
    // to avoid floating point precision headaches.
    const box = new THREE.Box3();
    box.setFromObject(ref.current);
    box.getCenter(ref.current.position).negate();
    // Force a matrix world update to make sure all calculations are synchronized
    ref.current.updateMatrixWorld();

    // Traverse the child meshes so we can create a merged gemoetry for BVH calculations.
    ref.current.traverse((c) => {
      // Only the gemoetry is relevant here
      if (c instanceof THREE.Mesh && c.geometry) {
        // Clone the geometry so it can safely be modified
        const cloned = c.geometry.clone();
        // Start by applying the world matrix of its parent for scale, rotation, translation, etc.
        cloned.applyMatrix4(c.matrixWorld);
        // All attributes except position so that the geometry can be safely merged
        for (const key in cloned.attributes) {
          if (key !== 'position') {
            cloned.deleteAttribute(key);
          }
        }
        geometries.push(cloned);
      }
    });
    // Merge the geometry
    let merged = BufferGeometryUtils.mergeBufferGeometries(geometries, false);
    merged = BufferGeometryUtils.mergeVertices(merged);

    // Simplify the geometry for better performance
    if (simplify) {
      const modifier = new SimplifyModifier();
      const count = Math.floor(merged.attributes.position.count * simplify);
      merged = modifier.modify(merged, count);
    }

    // Create a BVH for the geometry
    merged.boundsTree = new MeshBVH(merged, { strategy: SAH });
    // Create and store a mesh with BVH. We add a wireframe material for debugging
    const collider = new THREE.Mesh(
      merged,
      new THREE.MeshBasicMaterial({
        wireframe: true,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    );
    collider.raycast = acceleratedRaycast;
    collider.geometry.computeBoundsTree = computeBoundsTree;
    collider.geometry.disposeBoundsTree = disposeBoundsTree;

    setCollider(collider);

    init.current = false;
  }, [setCollider, simplify]);

  useEffect(() => {
    if (collider) {
      const visualizer = new MeshBVHVisualizer(collider, 10);
      setVisualizer(visualizer);
    }
  }, [collider]);

  // Dispose of the BVH if we unmount.
  useEffect(() => {
    return () => collider?.geometry.disposeBoundsTree();
  }, [collider?.geometry]);

  return (
    <>
      <group ref={ref}>{children}</group>
      {collider && <primitive visible={debug.collider} object={collider} />}
      {visualizer && <primitive visible={debug.visualizer} object={visualizer} />}
    </>
  );
}
