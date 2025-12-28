import React from 'react';
import type { Vector3 } from 'three';

export function RandomCircleDistribution(props: {
    position:Vector3;
    radius: number;
    count: number;
    children: React.ReactNode;
}) {
    const { position, radius, count, children } = props;

    const distributedChildren = Array.from({ length: count }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2; // Random angle in radians
        const x = position.x + Math.cos(angle) * radius;
        const z = position.z+ Math.sin(angle) * radius;
        const y = position.y // Keep the same y-coordinate

        return (
            <group key={i} position={[x, y, z]}>
                {React.cloneElement(children)}
                <mesh>
                    <sphereGeometry args={[1, 8, 8]} />
                </mesh>

            </group>
        );
    });
    return <>{distributedChildren}</>;
}
