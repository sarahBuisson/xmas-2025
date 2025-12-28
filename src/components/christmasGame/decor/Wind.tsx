import { Smoke, SmokeMaterial } from '../../common/shaders/smoke/Smoke.tsx';
import { extend, useFrame } from '@react-three/fiber';
import { BoxGeometry, CylinderGeometry, Euler, PlaneGeometry, SphereGeometry, Vector3 } from 'three';
import { useState } from 'react';
import { Float } from '@react-three/drei';

extend({SmokeMaterial, Smoke});

export function Wind(props: { position?: Vector3, rotation?: Euler, sizeWind: number }) {

    return <group {...props} >
        <Float floatingRange={[-4,1]}>
            <group rotation={[Math.PI / 2, 0, 0]} scale={[props.sizeWind, 1, 2]}>

                <Smoke speed={10} uSpeedRotation={0.1}
                       geometry={new PlaneGeometry(1,2)}></Smoke>
            </group>
        </Float>
    </group>
}
