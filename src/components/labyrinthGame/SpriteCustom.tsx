import { Color, Vector3 } from 'three';
import React, { Key, useRef } from 'react';
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei';
import * as THREE from "three";

export const SpriteCustom = (props: {
    position?: Vector3,
    scale?: Vector3,
    textureName: string,
    color?: Color,
    horizonColor?: Color, // couleur avec laquel le sprite se fond à l'horizzon
    farDistance: number, // distance à partir de laquel le sprite commence à se fondre
    transparentDistance: number, // distance à partir de laquel le sprite commence à se fondre
    horizonDistance: number, // distance à partir de laquel le sprite est totalement fondu
    key: Key | undefined
}) => {
    const texture = useTexture(props.textureName!!);
    const spriteRef = useRef<THREE.Sprite>(null!);
    const color = props.color || new Color("cyan")
    const horizonColor = props.horizonColor || new Color("white")
    const farDistance = props.farDistance || 20
    const horizonDistance = props.horizonDistance || 40
    const transparentDistance = props.transparentDistance || 1

    useFrame(({camera}) => {
        if (spriteRef.current) {
            const distance = camera.position.distanceTo(spriteRef.current.position);
            if (distance > horizonDistance) {
                spriteRef.current.material.color = horizonColor;
            } else if (distance > farDistance) {

                const colorIntensity = Math.min(1, Math.max(0, 1 - (distance - farDistance) / (horizonDistance - farDistance))); // Adjust range as needed
                spriteRef.current.material.color = color.clone().lerp(horizonColor, colorIntensity); // Example: gradient from red to green

            } else if (distance <= transparentDistance) {

                const opacityIntensity = Math.min(1, Math.max(0, (transparentDistance - distance) / transparentDistance)); // Adjust range as needed
                spriteRef.current.material.color = color; // Example: gradient from red to green

                spriteRef.current.material.opacity = 1 - opacityIntensity; // Example: gradient from red to green

            } else {
                spriteRef.current.material.opacity = 1;
                spriteRef.current.material.color = color
            }

        }
    });
    return (

        <sprite ref={spriteRef}
                key={props.key} position={props.position} scale={props.scale}>
            <spriteMaterial map={texture} color='green'/>

        </sprite>
    );
}
