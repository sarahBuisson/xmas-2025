import { useGLTF } from '@react-three/drei'
import { useEffect, useRef, useMemo } from 'react'
import { Object3D, BufferGeometry, Mesh, MeshStandardMaterial } from 'three'
import { clone } from './SkeletonUtils';

interface GLBModelProps {
    modelPath: string
    scale?: number
    position?: [number, number, number]
    rotation?: [number, number, number]
    onGeometryLoad?: (geometry: BufferGeometry) => BufferGeometry
    color?: string
}

export function GLBModel({
                             modelPath,
                             scale = 1,
                             position = [0, 0, 0],
                             rotation = [0, 0, 0],
                             onGeometryLoad,
                             color
                         }: GLBModelProps) {
    const gltf = useGLTF(modelPath)

    // Clone la scène pour chaque instance
    const scene = useMemo(() => clone(gltf.scene), [gltf.scene])

    const sceneRef = useRef<Object3D>(null)

    useEffect(() => {
        if (sceneRef.current) {
            // Parcourir tous les meshes
            sceneRef.current.traverse((child) => {
                if (child instanceof Mesh) {
                    // Appliquer la transformation de géométrie
                    if (onGeometryLoad && child.geometry) {
                        child.geometry = onGeometryLoad(child.geometry)
                    }
                    // Appliquer la couleur si spécifiée
                    if (color && child.material) {
                        console.log("color")
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                if (mat instanceof MeshStandardMaterial) {
                                    mat.color.set(color)
                                }
                            })
                        } else if (child.material instanceof MeshStandardMaterial) {
                            child.material.color.set(color)
                        }
                    }
                }
            })
        }
    }, [onGeometryLoad, color])

    return (
        <primitive
            ref={sceneRef}
            object={scene}
            scale={scale}
            position={position}
            rotation={rotation}
        />
    )
}
