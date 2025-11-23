import { Color, Texture, Vector3 } from 'three'
// @ts-ignore
import vertexShader from './shaders/vertex.glsl'
// @ts-ignore
import fragmentShader from './shaders/fragment.glsl'
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls, shaderMaterial, useTexture } from '@react-three/drei'




const BillBoardMaterial = shaderMaterial({
        uTexture:new Texture()
        // wireframe: true
    },
    vertexShader,

    fragmentShader);

extend({BillBoardMaterial})


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
