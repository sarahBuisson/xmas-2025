import * as THREE from 'three'
import React, { useState, useRef } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { UnrealBloomPass } from 'three-stdlib'

extend({ UnrealBloomPass })

function Particle({ position, color }) {
    const velocityRef = useRef(
        new THREE.Vector3(
            Math.random() * 0.1 - 0.05, // Adjust the range of x-component
            Math.random() * 0.12 - 0.05, // Adjust the range of y-component
            Math.random() * 0.1 - 0.05 // Adjust the range of z-component
        )
    )

    const meshRef = useRef<THREE.Mesh>()

    useFrame(() => {
        meshRef.current.position.add(velocityRef.current)
        velocityRef.current.y -= 0.0009 // gravity

        if (meshRef.current.position.y < -1 && meshRef.current) {
            meshRef.current.geometry.dispose()
            meshRef.current.material.dispose()
            if (meshRef.current.parent) {
                meshRef.current.parent.remove(meshRef.current)
                //  setIsDisposed(true);
            }
        }
    })

    return (
        <>
            <mesh ref={meshRef} position={position}>
                <sphereGeometry args={[0.02, 0, 0.01]}  />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    roughness={0.1}
                    metalness={10}
                    // @ts-ignore
                    shininess={100}
                />
            </mesh>
        </>
    )
}

function Fireworks(props: any) {
    const [particles, setParticles] = useState([])
    const [explode, setExplode] = useState(false)
    const fireworkRef = useRef<THREE.Mesh>()

    const onClick = () => {
        setExplode(true)
        // setIsDisposed(false);
    }

    useFrame(() => {
        if (explode) {
            const pos = fireworkRef.current.position

            for (let i = 0; i < 100; i++) {
                const color = new THREE.Color(Math.random() * 0xffffff)
                const position = new THREE.Vector3(pos.x, pos.y, pos.z)

                setParticles((prevState) => [...prevState, <Particle key={Math.random()} position={position} color={color} />])
            }

            setExplode(false)
        }

        setParticles((prevState) => prevState.filter(Boolean))
    })

    return (
        <>
            <mesh ref={fireworkRef} onClick={onClick} {...props} onPointerEnter={onClick}>
                <sphereGeometry args={[0.07, 8, 8]} />
                <meshBasicMaterial color={'orange'} />
                {particles}
            </mesh>
        </>
    )
}

export default Fireworks
