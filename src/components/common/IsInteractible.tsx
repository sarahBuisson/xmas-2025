import { useState } from 'react';
import { useFrame } from '@react-three/fiber';

enum InteractibleState {

}
export function IsInteractible(props:{children, onPointerDown?:()=>void}){
    const [hovered, setHovered] = useState(false);
    const [hoveredTime, setHoveredTime] = useState(0);
    const hoveredTimeMax = 2; // seconds

    useFrame((state, delta) => {
        if(hovered){
            console.log("hhhh")
            setHoveredTime((time) => {
                const newTime = time + delta;
                if(newTime >= hoveredTimeMax){
                    return hoveredTimeMax;
                }
                return newTime;
            });
        } else {
            setHoveredTime(0);
        }

    })
    return <group onPointerEnter={() => setHovered(true)}
                  onPointerLeave={() => setHovered(false)}
                  onPointerDown={ props.onPointerDown
                  }>
        <mesh position={props.children.position || [0,0,0]}>
            <sphereGeometry args={[1, 4,4]}/>
            <meshBasicMaterial color={'cyan'}
            transparent={true}
            opacity={(0.5*hoveredTime/hoveredTimeMax)}
            />
        </mesh>
        {hovered}
        {hoveredTime}
        {props.children}
    </group>
}
