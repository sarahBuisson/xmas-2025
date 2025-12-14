import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { BufferGeometry, Mesh } from 'three';

interface GLBToGeometryRendererProps {
    modelPath: string;
    position?: [number, number, number];
    scale?: number;
    color?: string;
}

export const GLBGeometry = ({
                                          modelPath,
                                          position = [0, 0, 0],
                                          scale = 1,
                                          color = 'white',
                                      }: GLBToGeometryRendererProps) => {
    const gltf = useGLTF(modelPath);

    const geometries = useMemo(() => {
        const extractedGeometries: BufferGeometry[] = [];
        gltf.scene.traverse((child) => {
            if (child instanceof Mesh && child.geometry) {
                extractedGeometries.push(child.geometry.clone());
            }
        });
        return extractedGeometries;
    }, [gltf]);

    return (
        <group position={position} scale={[scale, scale, scale]}>
            {geometries.map((geometry, index) => (
                <mesh key={index} geometry={geometry}>
                    <meshStandardMaterial color={color} />
                </mesh>
            ))}
        </group>
    );
};
