import * as THREE from 'three'

// @ts-ignore
import coffeeSmokeVertexShader from './shaders/coffeeSmoke/vertex.glsl'
// @ts-ignore
import coffeeSmokeFragmentShader from './shaders/coffeeSmoke/fragment.glsl'
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'

// Loaders
const textureLoader = new THREE.TextureLoader()




export function Fire() {

    /**
     * Smoke
     */
// Geometry
    const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64)
    smokeGeometry.translate(0, 0.5, 0)
    smokeGeometry.scale(1.5, 6, 1.5)

// Perlin texture
    const perlinTexture = textureLoader.load('./perlin.png')
    perlinTexture.wrapS = THREE.RepeatWrapping
    perlinTexture.wrapT = THREE.RepeatWrapping

// Material
    const smokeMaterial = new THREE.ShaderMaterial({
        vertexShader: coffeeSmokeVertexShader,
        fragmentShader: coffeeSmokeFragmentShader,
        uniforms:
            {
                uTime: new THREE.Uniform(0),
                uPerlinTexture: new THREE.Uniform(perlinTexture)
            },
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false
        // wireframe: true
    })

    /**
     * Animate
     */
    const clock = new THREE.Clock()
/*
    const tick =*/useFrame( () => {
        const elapsedTime = clock.getElapsedTime()

        // Update smoke
        smokeMaterial.uniforms.uTime.value = elapsedTime

        // Update controls

    })
return <mesh geometry={smokeGeometry} material={smokeMaterial} />

}
export  function SmockeApp() {
    return (
        <Canvas>
            <ambientLight />
            <Fire />
            <OrbitControls/>
        </Canvas>
    );
}
