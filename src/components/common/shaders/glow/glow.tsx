import * as THREE from 'three'
import { Color, Vector3 } from 'three'
// @ts-ignore
import vertexShader from './shaders/vertex.glsl'
// @ts-ignore
import fragmentShader from './shaders/fragment.glsl'
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls, shaderMaterial } from '@react-three/drei'


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

export const Glow = shaderMaterial({


        vColor: new Color(0xa0522d),
        vOpacity: 1,
        pixelRatio: 1,
        vTime: 1,

        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false
        // wireframe: true
    },
    vertexShader,
    fragmentShader);

extend({ Glow})

export function GlowDemo() {
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
                <sphereGeometry args={[1, 32, 32]}/>
                <meshStandardMaterial color={new Color(0x0000ff)}/>
            </mesh>
            <mesh position={new Vector3(1, 1, 1)}>
                <sphereGeometry args={[1, 32, 32]}/>
                <Glow color={(0x00ff00)}/>
            </mesh>
            <OrbitControls/>
        </Canvas>
    );
}
