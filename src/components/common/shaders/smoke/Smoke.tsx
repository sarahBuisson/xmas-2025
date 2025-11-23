import * as THREE from 'three'
// @ts-ignore
import coffeeSmokeVertexShader from './shaders/coffeeSmoke/vertex.glsl'
// @ts-ignore
import coffeeSmokeFragmentShader from './shaders/coffeeSmoke/fragment.glsl'
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'
import { BufferGeometry, Color, SphereGeometry, Vector3 } from 'three';

// Loaders
const textureLoader = new THREE.TextureLoader()



export function Smoke(props: {
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

// Perlin texture
    const perlinTexture = textureLoader.load(props.texture || './perlin.png')
    perlinTexture.wrapS = THREE.RepeatWrapping
    perlinTexture.wrapT = THREE.RepeatWrapping

// Material
    const smokeMaterial = new THREE.ShaderMaterial({
        vertexShader: coffeeSmokeVertexShader,
        fragmentShader: coffeeSmokeFragmentShader,
        uniforms:
            {
                uTime: new THREE.Uniform(0),
                uColor: new THREE.Uniform(props.color || new Color(0xffffff)),
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
/* const tick = */useFrame(() => {
        const elapsedTime = clock.getElapsedTime()

        // Update smoke
        smokeMaterial.uniforms.uTime.value = elapsedTime

        // Update controls

    })
    return <mesh geometry={geometry} material={smokeMaterial} position={props.position}/>

}

export function SmockeApp() {
    return (
        <Canvas>
            <ambientLight/>
            <Smoke color={new Color(0x00aa00)}
                   geometry={new SphereGeometry()}

                   position={new Vector3(1, 1, 1)}/>
            <OrbitControls/>
        </Canvas>
    );
}
