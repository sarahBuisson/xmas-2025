import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';


export function ProgressiveAppear(props: {
    children: React.ReactNode,
    appearTimeMax?: number,
    appear?: (timePercent: number) => void
}) {
    const {
        appearTimeMax = 1.0,
        appear = (timePercent: number) => {
            setGroupProps({
                scale: timePercent
            });
        },
    } = props;
    const [time, setTime] = useState(0.0);
    const [groupProps, setGroupProps] = useState<any>({scale: 0});


    useFrame((state, delta) => {

        setTime((time) => {
            const newTime = time + delta;

            if (newTime >= appearTimeMax) {
                return appearTimeMax;
            }
            appear(time / appearTimeMax)
            return newTime;
        });


    })
    return <group {...groupProps}>
        {props.children}
    </group>
}
