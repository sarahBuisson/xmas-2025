import { Color, Texture, Vector3 } from 'three'
// @ts-ignore
import vertexShader from './shaders/vertex.glsl'
// @ts-ignore
import fragmentShader from './shaders/fragment.glsl'
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls, shaderMaterial, useTexture } from '@react-three/drei'
import * as THREE from 'three';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}


export const SuperflatMaterial = shaderMaterial({
        uTexture: new Texture(),
        uCameraDecalage: 0,
        ratioX: 5,
        ratioY: 25,
        uResolution: new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio),
        fogColor: new Color(0x000000),
        fogNear: 3,
        fogFar: 15,

        // wireframe: true
    },
    vertexShader,

    fragmentShader);

export const SuperflatBisMaterial = shaderMaterial({
        uTexture: new Texture(),
        uCameraDecalage: 0,
        ratioX: 5,
        ratioY: 25,
        uResolution: new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio),
        fogColor: new Color(0x000000),
        fogNear: 3,
        fogFar: 15,

        // wireframe: true
    },
    "\n" +
    "varying vec3 vPosition;\n" +
    "varying vec3 vNormal;\n" +
    "varying vec2 vUv;\n" +
    "\n" +
    "void main()\n" +
    "{\n" +
    "       vUv = uv;\n" +
    "    // Position\n" +
    "    vec4 modelPosition = modelMatrix * vec4(position, 1.0);\n" +
    "    gl_Position = projectionMatrix * viewMatrix * modelPosition;\n" +
    "\n" +
    "    // Model normal\n" +
    "    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;\n" +
    "\n" +
    "    // Varyings\n" +
    "    vNormal = modelNormal;\n" +
    "    vPosition = modelPosition.xyz;\n" +
    "}\n",

    fragmentShader);

extend({SuperflatMaterial})


function BillboardScene() {
    let texture = useTexture("vite.svg");
    return <mesh position={new Vector3(1, 1, 1)}>
        <boxGeometry/>
        <billBoardMaterial uTexture={texture}/>
    </mesh>;
}

export function BillboardDemo() {

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
            <BillboardScene></BillboardScene>
            <OrbitControls/>
        </Canvas>
    );
}
