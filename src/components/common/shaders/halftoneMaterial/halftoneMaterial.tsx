import * as THREE from 'three'
// @ts-ignore
import vertexShader from './shaders/vertex.glsl'
// @ts-ignore
import fragmentShader from './shaders/fragment.glsl'
import { OrbitControls } from '@react-three/drei'
import { BufferGeometry, Color, SphereGeometry, Vector3 } from 'three';
import React from 'react';
import { Canvas } from '@react-three/fiber';


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}


export function HalftoneMaterialMesh(props: {
    color?: Color,
    geometry?: BufferGeometry,
    texture?: string,
    scale?: Vector3 | number,
    position?: Vector3
}) {

    /**
     * Smoke
     */
// Geometry
    let geometry;
    if (props.geometry)
        geometry = props.geometry
    else {
        geometry = new THREE.PlaneGeometry(1, 1, 16, 64)
        if (props.position)
            geometry.translate(props.position.x, props.position.y + 0.5, props.position.z)
        else
            geometry.translate(0, 0.5, 0)
        if (props.scale) {
            // @ts-ignore
            if (!isNaN(props.scale)) {
                // @ts-ignore
                geometry.scale(props.scale,props.scale,props.scale)
            } else if(props.scale instanceof Vector3) {
                geometry.scale(props.scale.x, props.scale.y, props.scale.z)
            }
        } else {
            geometry.scale(1.5, 6, 1.5)
        }
    }


// Material
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms:
            {
                uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
                uColor: {value: new Color(0xa0522d)},
                uShadowColor: {value: new Color(0x50520d)},
                uLightColor: {value: new Color(0xf0522d)},
                uShadowRepetitions: {value: 105.0},
                uLightRepetitions: {value: 150.0},
            },
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false
        // wireframe: true
    });
    return <mesh geometry={geometry} material={material} position={props.position}/>

}

export function HalftoneDemo() {
    return (
        <Canvas>
            <color attach="background" args={["black"]}/>
            <spotLight
                position={[0, 10, 0]} // Position above the scene
                angle={0.5} // Cone angle
                penumbra={0.3} // Softness of edges
                intensity={2} // Brightness
                distance={50} // Maximum range
                decay={2} // Light fading rate
                color="white" // Light color
                castShadow // Enable shadows
            />
            <mesh position={new Vector3(3, 1, 1)}>
                <sphereGeometry args={[1, 32, 32]}  />
    <meshStandardMaterial color={new Color(0x0000ff)} />
            </mesh>
            <HalftoneMaterialMesh color={new Color(0x00ff00)}
                              geometry={new SphereGeometry()}

                              position={new Vector3(1, 1, 1)}/>
            <OrbitControls/>
        </Canvas>
    );
}
