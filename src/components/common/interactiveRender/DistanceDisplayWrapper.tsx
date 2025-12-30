
const displayAll = false; // Global constant to override visibility
import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { hexaSize } from '../../christmasGame/constant.tsx';

export const DistanceDisplayWrapper = (props: {
    children?: React.ReactNode;
    position: Vector3;
    maxDistance?: number;
}) => {
    const { position, maxDistance = hexaSize, children } = props;
    const { camera } = useThree();
    const [isVisible, setIsVisible] = useState(true);
    const groupRef = useRef<Group>(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    useFrame((state, delta) => {
        setElapsedTime((prev) => prev + delta);

        if (elapsedTime >= 3) { // Check every 3 seconds
            setElapsedTime(0);

            if (displayAll) {
                setIsVisible(true);
                return;
            }

            const cameraPosition = new Vector3().copy(camera.position);
            const distance = cameraPosition.distanceTo(position);
            setIsVisible(distance <= maxDistance);
        }
    });

    return <group ref={groupRef} {...props}>{isVisible ? children : null}</group>;
};
