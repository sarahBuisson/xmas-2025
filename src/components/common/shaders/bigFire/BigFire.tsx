import * as THREE from 'three'
import { BoxGeometry, BufferGeometry, Color, Vector3 } from 'three'
// @ts-ignore
import coffeeSmokeVertexShader from './shaders/coffeeSmoke/vertex.glsl'
// @ts-ignore
import coffeeSmokeFragmentShader from './shaders/coffeeSmoke/fragment.glsl'
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'
import React from 'react';
import firePng from './fire.png'
// Loaders
const textureLoader = new THREE.TextureLoader()


export function BigFire(props: {
    color?: Color,
    geometry?: BufferGeometry,
    texture?: string,
    scale?: Vector3 | number,
    position?: Vector3
}) {
    console.log(firePng)

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
                geometry.scale(props.scale, props.scale, props.scale)
            } else if (props.scale instanceof Vector3) {
                geometry.scale(props.scale.x, props.scale.y, props.scale.z)
            }
        } else {
            geometry.scale(1.5, 6, 1.5)
        }
    }

// Perlin texture
    const perlinTexture = textureLoader.load(props.texture || './perlin.png')
    perlinTexture.wrapS = THREE.RepeatWrapping
    perlinTexture.wrapT = THREE.RepeatWrapping
    const texture = useLoader(THREE.TextureLoader, firePng)
    texture.magFilter = texture.minFilter = THREE.LinearFilter
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping

// Material
    const fireMaterial = new THREE.ShaderMaterial({
        vertexShader: coffeeSmokeVertexShader,
        fragmentShader: coffeeSmokeFragmentShader,
        defines: {ITERATIONS: '10', OCTIVES: '3'},
        uniforms: {
            fireTex: {type: 't', value: texture},
            color: {type: 'c', value: new THREE.Color(0xffeeee)},
            time: {type: 'f', value: 0.0},
            seed: {type: 'f', value: Math.random() * 19.19},
            invModelMatrix: {type: 'm4', value: new THREE.Matrix4()},
            scale: {type: 'v3', value: new THREE.Vector3(1, 1, 1)},
            noiseScale: {type: 'v4', value: new THREE.Vector4(1, 2, 1, 0.3)},
            magnitude: {type: 'f', value: 2.5},
            lacunarity: {type: 'f', value: 3.0},
            gain: {type: 'f', value: 0.6}
        },
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false
        // wireframe: true
    })

    /**
     * Animate
     */
    /* const tick = */
    useFrame((state) => {
        // Update smoke
        fireMaterial.uniforms.time.value = state.clock.elapsedTime

        // Update controls

    })
    return <mesh geometry={geometry} material={fireMaterial} position={props.position}/>

}

export function FireLikeSmockeApp() {
    return (
        <Canvas>
            <color attach="background" args={["black"]}/>
            <ambientLight/>
            <BigFire color={new Color(0x00aa00)}
                     geometry={new BoxGeometry(2, 2, 2)}

                     position={new Vector3(1, 1, 1)}/>
            <OrbitControls/>
        </Canvas>
    );
}
