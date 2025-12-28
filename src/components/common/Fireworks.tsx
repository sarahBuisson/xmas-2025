import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import { UnrealBloomPass } from 'three-stdlib'

extend({UnrealBloomPass})

function Particle({position, color}) {
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
                <sphereGeometry args={[0.2, 2, 0.01]}/>
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                />
            </mesh>
        </>
    )
}

function Fireworks(props: { computeColor: (index) => THREE.Color, explodeFromStart?: boolean, neverStop?: boolean }) {
    const {
        computeColor = () => {
            return new THREE.Color(Math.random() * 0x0000ff + 0x22aabb);
        },
        explodeFromStart = false,
        neverStop = false
    } = props

    const [particles, setParticles] = useState([])
    const [explode, setExplode] = useState(explodeFromStart)
    const fireworkRef = useRef<THREE.Mesh>(null)



    useFrame(() => {
            if (explode &&fireworkRef.current) {
                const pos = fireworkRef.current.position

                for (let i = 0; i < 1; i++) {
                    const color = computeColor(i)
                    const position = new THREE.Vector3(pos.x, pos.y, pos.z)

                    if(props.children){
                        React.cloneElement(props.children as React.ReactElement, {key: Math.random(), position: position, color: color})
                    }else {
                        setParticles((prevState) => [...prevState,
                            <Particle key={Math.random()} position={position} color={color}/>])
                    }
                }
                if (!neverStop)
                    setExplode(false)
            }

            setParticles((prevState) => prevState.filter(Boolean))
        }
    )

    return (
        <>
            <mesh ref={fireworkRef}>
                {particles}
            </mesh>
        </>
    )
}

export default Fireworks
