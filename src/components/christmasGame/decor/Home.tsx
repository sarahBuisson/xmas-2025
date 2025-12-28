import DynamicSvg from '../../common/DynamicSvg.tsx';
import ExtrudedSvg from '../../common/ExtrudedSvg.tsx';
import type { Shape, Vector3 } from 'three';
import { DoubleSide } from 'three';
import FakeGlowMaterial from '../../common/material/FakeGlowMaterial.tsx';
import React from 'react';
import { RoundedBoxGeometry } from '@react-three/drei';


export function Home(props: { position?:Vector3 }) {
    function customProcess(shape: Shape[], shapeIndex: number, svgData: any) {
        return {
            depth: svgData.paths[shapeIndex].color.getHSL({}).l,
            bevelEnabled: false,
            steps: 1,
        };
    }

    function customProcessMaterial(shape: any, shapeIndex: number, svgData: any): any {
        return <meshStandardMaterial color={"grey"} side={DoubleSide}/>
    }


    return <group {...props}>
        <group rotation={[0, 0, -Math.PI]} position={[0, 0, -2]} scale={[3, 0.25, 0.25]}>
            <ExtrudedSvg svgPath={"./christmas/home.svg"}
                         customProcessMaterial={customProcessMaterial}
                         customProcess={customProcess} symmetric={true}></ExtrudedSvg>
        </group>
        <mesh position={[0, 1.7, 0.5]}>
            <RoundedBoxGeometry args={[3, 1.35, 1]}></RoundedBoxGeometry>
            <meshBasicMaterial color={"orange"} transparent={true} opacity={0.7} side={DoubleSide}></meshBasicMaterial>
        </mesh>
        <mesh position={[-1, 1.75, 0.5]}>
            <boxGeometry args={[1, 1.5, 1]}></boxGeometry>
            <meshStandardMaterial color={"black"} side={DoubleSide} ></meshStandardMaterial>
        </mesh>
    </group>
}
