import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Curve, Vector3 } from 'three';

export function MoveOnClickWrapper({
                                       children,
                                       callOnStart,
                                       callEvery,
    everyInterval,
                                       trajectory,
                                       callOnEnd,
                                   }: {
    trajectory: Curve<Vector3>
    children: React.ReactNode;
    callOnStart: () => void;
    callEvery?: (v:Vector3) => void;
    everyInterval?:number
    callOnEnd: () => void;
}) {
    console.log("rrrr")
    const [position, setPosition] = useState(trajectory.getPointAt(0));
    const [isMoving, setIsMoving] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [elapsedIntervalTime, setElapsedIntervalTime] = useState(0);
console.log("move Pos", position)
    useFrame((_, delta) => {

        if (isMoving) {
            console.log("move")
            const duration = 5; // 5 seconds
            const newElapsedTime = elapsedTime + delta;
            let newElapsedIntervalTime = elapsedIntervalTime + delta;
            const t = Math.min(newElapsedTime / duration, 1); // Clamp t between 0 and 1

            if (trajectory) {
                const newPosition = trajectory.getPointAt(t)

                setPosition(newPosition);
                if(everyInterval && callEvery)
                    if(newElapsedIntervalTime>everyInterval) {
                        newElapsedIntervalTime = 0
                        callEvery(newPosition);
                    }
            }


            setElapsedTime(newElapsedTime);
            setElapsedIntervalTime(newElapsedIntervalTime);

            if (t === 1) {
                if (callOnEnd)
                    callOnEnd()
                setIsMoving(false); // Stop moving when the animation is complete
            }
        }
    });

    const handleClick = () => {
        console.log("click")
        if (!isMoving) {
            if (callOnStart)
                callOnStart()
            setElapsedTime(0); // Reset elapsed time
            setIsMoving(true); // Start moving
        }
    };

    return (
        <group position={position} onPointerDown={handleClick}>
            {children}
        </group>
    );
}
