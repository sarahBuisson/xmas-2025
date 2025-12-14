import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

export function MoveOnClickWrapper({
                                       origin,
                                       destination,
                                       children,
                                       callOnStart,
    callOnEnd,
                                   }: {
    origin: Vector3;
    destination: Vector3;
    children: React.ReactNode;
    callOnStart: () => void;
    callOnEnd: () => void;
}) {
    const [position, setPosition] = useState(new Vector3(...origin));
    const [isMoving, setIsMoving] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    useFrame((_, delta) => {

        if (isMoving) {console.log("move")
            const duration = 5; // 5 seconds
            const newElapsedTime = elapsedTime + delta;
            const t = Math.min(newElapsedTime / duration, 1); // Clamp t between 0 and 1

            const newPosition = new Vector3().lerpVectors(
                origin,
                destination,
                t
            );

            setPosition(newPosition);
            setElapsedTime(newElapsedTime);

            if (t === 1) {
                if(callOnEnd)
                callOnEnd()
                setIsMoving(false); // Stop moving when the animation is complete
            }
        }
    });

    const handleClick = () => {
        console.log("click")
        if (!isMoving) {
            if(callOnStart)
            callOnStart()
            setElapsedTime(0); // Reset elapsed time
            setIsMoving(true); // Start moving
        }
    };

    return (
        <group position={position.toArray()} onClick={handleClick}>
            {children}
        </group>
    );
}
