import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { Bouncy } from '../Bouncy.tsx';
import FakeGlowMaterial from '../material/FakeGlowMaterial.tsx';

enum InteractibleState {

}

export function IsInteractible(props: {
    children: React.ReactNode,
    onPointerEnter?: () => void,
    onPointerDown?: () => void
}) {
    const [hovered, setHovered] = useState(false);
    const [hoveredTime, setHoveredTime] = useState(0);
    const hoveredTimeMax = 1; // seconds

    useFrame((state, delta) => {
        if (hovered) {
            setHoveredTime((time) => {
                const newTime = time + delta;
                if (newTime >= hoveredTimeMax) {
                    return hoveredTimeMax;
                }
                return newTime;
            });
        } else {
            setHoveredTime((time) => {
                const newTime = time - delta;
                if (newTime < 0) {
                    return 0;
                }
                return newTime;
            });
        }

    })
    return <group onPointerEnter={() => setHovered(true)}
                  onPointerLeave={() => setHovered(false)}
                  onPointerDown={props.onPointerDown
                  }>

            <mesh position={props.children.position || [0, 0, 0]}>
                <sphereGeometry args={[2, 4, 4]}/>
                <meshBasicMaterial color={'cyan'}
                                   transparent={true}
                                   opacity={(0.1  * hoveredTime / hoveredTimeMax)}
                />
                <FakeGlowMaterial glowColor={"cyan"} glowSharpness={hovered?3:1}></FakeGlowMaterial>
            </mesh>
                {props.children}


    </group>
}
