import * as THREE from 'three'
// @ts-ignore
import vertexShader from './shaders/vertex.glsl'
// @ts-ignore
import fragmentShader from './shaders/fragment.glsl'
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls, shaderMaterial } from '@react-three/drei'
import { BufferGeometry, Color, SphereGeometry, Vector3 } from 'three';


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

const HalftoneMaterial2 = shaderMaterial({


    uResolution:  new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio),
    uColor:  new Color(0xa0522d),
    uShadowColor:  new Color(0x50520d),
    uLightColor:  new Color(0xf0522d),
    uShadowRepetitions:  105.0,
    uLightRepetitions:  150.0,

    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false
    // wireframe: true
},
    vertexShader,
    fragmentShader);

extend({HalftoneMaterial2})

export function Halftone2Demo() {
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
            <mesh   position={new Vector3(1, 1, 1)}>
                <sphereGeometry args={[1, 32, 32]}/>
            <halftoneMaterial2 color={(0x00ff00)} />
            </mesh>
            <OrbitControls/>
        </Canvas>
    );
}
