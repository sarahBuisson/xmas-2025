import { useFrame } from '@react-three/fiber';
import React from 'react';
import { Float, Sparkles } from '@react-three/drei';

export const MousedWrapper = (props: {
    children: React.ReactNode;
    onPointerOver?: () => void;
    onPointerOut?: () => void;
    onClick?: () => void
    floatIntensity: number,
    position?: [number, number, number]
    scale?: number| [number, number, number]
}) => {

    const [hoover, setHover] = React.useState(false);
    const [hooverTime, setHoverTime] = React.useState(0);

    const [clicked, setClicked] = React.useState(false);
    const [clickedTime, setClickedTime] = React.useState(0);

    useFrame((_, delta) => {
        if (hoover) {
            setHoverTime(hooverTime + delta);
        } else {
            setHoverTime(hooverTime - delta);
        }
        if (clicked) {
            setClickedTime(clickedTime + delta);
        }
    })

    return <group {...props}
        onPointerOver={() => {
            setHover(true);
            setHoverTime(0)
            props.onPointerOver ? props.onPointerOver() : null
        }}
        onPointerOut={() => {
            setHover(false);
            props.onPointerOut ? props.onPointerOut() : null;
        }}
        onClick={() => {
            setClicked(true);
            setClickedTime(0);
            props.onClick ? props.onClick() : null;
        }}
    >
        <Float floatIntensity={hoover ? Math.min(Math.max(0, hooverTime * 2), props.floatIntensity || 1) : 0}
               floatingRange={[1, 0]}>

            {props.children}
            <mesh >
                <Sparkles count={hoover?hooverTime*100:0} scale={2} size={6} speed={0.4} color={"yellow"}></Sparkles>
            </mesh>
        </Float>

    </group>
}
