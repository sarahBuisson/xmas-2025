import * as React from 'react';
import type { ThreeElements } from '@react-three/fiber';
import { extend, useFrame } from '@react-three/fiber'
import { Group } from 'three';


export type BouncyProps = Omit<ThreeElements['group'], 'ref'> & {
    enabled?: boolean
    speed?: number
    bounceIntensity?: number
    children?: React.ReactNode
    autoInvalidate?: boolean
    bounceOnGround?: boolean
}

export const Bouncy =
    (
        {
            children,
            enabled = true,
            speed = 1,
            bounceIntensity = 0.5,
            autoInvalidate = false,
            bounceOnGround = false,
            ...props
        }
    ) => {
        const ref = React.useRef<Group>(null!)
        const offset = React.useRef(Math.random() * 10000)
        useFrame((state) => {
            if (!enabled || speed === 0) return

            if (autoInvalidate) state.invalidate()

            const t = offset.current + state.clock.elapsedTime
            ref.current.scale.x =1.0+ Math.cos(t / 4 * speed) / 8 * bounceIntensity;
            ref.current.scale.y =1.0+ Math.sin(t / 4 * speed) / 8 * bounceIntensity;
            ref.current.scale.z = 1.0+ Math.sin(t / 4 * speed) / 20 * bounceIntensity;
            if (bounceOnGround) {
                ref.current.position.y -= Math.sin(t / 4 * speed) / 16
            }
            ref.current.updateMatrix()
        })
        return (
            <group {...props}>
                <group ref={ref} matrixAutoUpdate={false}>
                    {children}
                </group>
            </group>
        )
    }

