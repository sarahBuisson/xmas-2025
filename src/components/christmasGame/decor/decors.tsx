import { CatmullRomCurve3, Color, DoubleSide, Euler, Vector3 } from "three";
import { Float, RoundedBoxGeometry, Sparkles, useTexture } from '@react-three/drei';
import React, { useState } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { CustomNormalMaterial } from '../../common/shaders/customNormal/CustomNormalMaterial.tsx';
import { CustomTubeGeometry } from '../../common/CustomTubeGeometry.tsx';
import { RigidBody } from '@react-three/rapier';
import { IsInteractible } from '../../common/interactiveRender/IsInteractible.tsx';
import FakeGlowMaterial from '../../common/material/FakeGlowMaterial.tsx';
import Fireworks from '../../common/Fireworks.tsx';
import IntrinsicElements = React.JSX.IntrinsicElements;

extend({CustomTubeGeometry});

export function GreenSapin(props: { position: [number, number, number] }) {

    return <group {...props}>
        <mesh position={[0, 0, 0]}>
            <coneGeometry args={[1.8, 3, 24]}></coneGeometry>
            <meshStandardMaterial color={"green"}></meshStandardMaterial>
        </mesh>
        <mesh position={[0, 1, 0]}>
            <coneGeometry args={[1.5, 3, 24]}></coneGeometry>
            <meshStandardMaterial color={"green"}></meshStandardMaterial>
        </mesh>
        <mesh position={[0, 2, 0]}>
            <coneGeometry args={[1.4, 3, 24]}></coneGeometry>
            <meshStandardMaterial color={"green"}></meshStandardMaterial>
        </mesh>
    </group>
}

export function GiftBox(props: {
    paperMaterial?: any,
    rubanMaterial?: any,
    sizes?: [number, number, number],
    rubanWidth: number,
    rubanEpaisseur: number
} & IntrinsicElements['mesh']) {
    const {
        paperMaterial = <meshStandardMaterial color={"red"}></meshStandardMaterial>,
        rubanMaterial = <meshStandardMaterial color={"gold"}></meshStandardMaterial>,
        sizes = [1, 1, 1],
        rubanWidth = 0.1,
        rubanEpaisseur = 0.05
    } = props;
    return <RigidBody type="fixed">
        <group {...props}>
            <group position={[0, sizes[1] / 2, 0]}>
                <mesh position={[0, 0, 0]}>
                    <RoundedBoxGeometry args={sizes}></RoundedBoxGeometry>
                    {paperMaterial}
                </mesh>
                <mesh position={[0, 0, 0]}>
                    <RoundedBoxGeometry
                        args={[0 + rubanWidth, sizes[1] + rubanEpaisseur, sizes[2] + rubanEpaisseur]}></RoundedBoxGeometry>
                    {rubanMaterial}
                </mesh>
                <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                    <RoundedBoxGeometry
                        args={[sizes[0] + rubanEpaisseur, 0 + rubanWidth, sizes[2] + rubanEpaisseur]}></RoundedBoxGeometry>
                    {rubanMaterial}    </mesh>
                <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                    <RoundedBoxGeometry
                        args={[sizes[0] + rubanEpaisseur, sizes[1] + rubanEpaisseur, 0 + rubanWidth]}></RoundedBoxGeometry>
                    {rubanMaterial} </mesh>
            </group>
        </group>
    </RigidBody>
}


export function computeSpiralPoint(animatePercent: number, nbrOfTurn: number, radius: number, offset: number | undefined, height: number): number[] {

    const angle = ((100 - animatePercent) / 100) * Math.PI * nbrOfTurn * 2; // Angle for each point
    const x = ((100 - animatePercent) / 100) * radius * Math.cos(angle + (offset || 0));
    const z = ((100 - animatePercent) / 100) * radius * Math.sin(angle + (offset || 0));
    const y = ((animatePercent) / 100) * height; // Linear height increment

    const point = [x, y, z]

    return point;
}

export const AnimateSpiralGeometry = (props: {
    radius: number;
    height: number;
    turns: number;
    offset?: number;
    stopHeight?: number,
    onAnimateComplete?: (points: Vector3[]) => void;
    onAnimateStart?: () => void;

} & IntrinsicElements['mesh']) => {

    const [animate, setAnimate] = React.useState(false);
    const [animateEnd, setAnimateEnd] = React.useState(false);
    const [animatePercent, setAnimatePercent] = React.useState(0);

    const {radius, height, turns, offset, stopHeight} = props;
    const pointCounts = 100; // Number of points per turn
    const totalPointCounts = pointCounts * turns;

    function getComputeSpiralPoint(animatePercent: number) {
        return computeSpiralPoint(animatePercent, turns, radius, offset, height);
    }

    const [points, setPoints] = React.useState<any[]>([
        getComputeSpiralPoint(0.1)]);

    useFrame((_, delta) => {
        if (animate && (animatePercent < 100)) {
            let time = animatePercent + 1;
            setAnimatePercent(animatePercent + 1);
            setPoints([...points, getComputeSpiralPoint(animatePercent)]);

        } else {
            if (animatePercent >= 100 && !animateEnd) {
                console.log("finished animation", props.onAnimateComplete);
                setAnimateEnd(true);
                const vecPoints = points.filter(p => p[1] > -props.height / 3 && p[1] < props.height * 2 / 3).map(it => new Vector3(...it));

                if (props.onAnimateComplete) {
                    console.log("complete")
                    props.onAnimateComplete(vecPoints);
                }
            }

        }
    })
    return <group {...props}>
        <group
            position={points[points.length - 1]}
            scale={0.2}
        ><IsInteractible onPointerDown={() => {
            setAnimate(true);
            if (props.onAnimateStart)
                props.onAnimateStart()
        }}>
            <TreeBall count={15} sparkling={animate}></TreeBall>

        </IsInteractible>
        </group>
        <mesh position={points[0]}>
            <sphereGeometry args={[radius / 16, 64]}></sphereGeometry>
            <CustomNormalMaterial color1={new Color("cyan")}
                                  color2={new Color("#87CEEB")}
                                  color3={new Color("white")}></CustomNormalMaterial>


        </mesh>
        {points.length > 1 ? <>

                <mesh position={[0, 0, 0]}>
                    <tubeGeometry
                        args={[new CatmullRomCurve3(points.map(it => new Vector3(...it))), points.length, 0.04, 16]}></tubeGeometry>

                    <CustomNormalMaterial color1={new Color("cyan")}
                                          color2={new Color("#87CEEB")}
                                          color3={new Color("white")}></CustomNormalMaterial>

                </mesh>
                <mesh position={[0, points[points.length - 1][1] - height / 2.5, 0]} scale={[1, height, 1]}>
                    <sphereGeometry args={[radius / 2 + 0.2, 64]}></sphereGeometry>
                    <meshStandardMaterial color={"cyan"} transparent={true} opacity={0.5}></meshStandardMaterial>
                    <FakeGlowMaterial side={DoubleSide} glowColor={"cyan"} opacity={0.1}></FakeGlowMaterial>
                </mesh>
            </>
            : ""}
        {animatePercent >= 95 ?
            <>
            </> : ""}
        {animate && animatePercent <= 95 ?
            <mesh position={points[points.length - 1]}>
                <Fireworks></Fireworks>
            </mesh> : ""}
    </group>;
};

export function Crystal() {
    return <group>
        <mesh scale={[0.1, 1, 0.2]}>
            <octahedronGeometry args={[2, 0]}></octahedronGeometry>

            <CustomNormalMaterial color1={new Color("cyan")}
                                  color2={new Color("#87CEEB")}
                                  color3={new Color("white")}

            ></CustomNormalMaterial>
        </mesh>
    </group>;
}

export const TreeBall = (props: { count: number, sparkling: boolean }) => {

    const [rotations, setRotations] = useState<Euler[]>(() => {


        const result = [];
        for (let i = 0; i < props.count; i++) {
            result.push(new Euler(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2));
        }

        return result
    })


    const elements = rotations?.map((r, index) => (
        <Float rotationIntensity={2} floatingRange={[0, 0]} key={"treeball-" + index}>

            <group rotation={r}>

                <Float rotationIntensity={0} floatingRange={[-2, 2]}>
                    {Crystal(props)}
                </Float>
                <mesh>
                    <sphereGeometry args={[0.3, 8, 8]}></sphereGeometry>
                    <meshStandardMaterial color={"yellow"} transparent={true} opacity={0}></meshStandardMaterial>
                    <Sparkles count={5}></Sparkles>
                </mesh>
            </group>
        </Float>)
    )
    return <group>{elements}</group>
}

export const Ornement = (props: { position?: Vector3, scale?: number }) => {
    return <group {...props}>
        <Crystal></Crystal>
    </group>
}
export const Drop = (props: { position?: Vector3 }) => {
    return <group {...props} >
        <Ornement scale={0.1}></Ornement>
        <mesh>
            <sphereGeometry></sphereGeometry>
            <meshStandardMaterial color={"cyan"} transparent={true} opacity={0.5}></meshStandardMaterial>
            <FakeGlowMaterial side={DoubleSide} glowColor={"cyan"} opacity={0.1}></FakeGlowMaterial>
        </mesh>
    </group>
}

export const Moon = (props: { position?: Vector3, onPointerDown: () => void }) => {

    const texture = useTexture("./ivoryLeather.jpg");
    return <group {...props} >
        <mesh>
            <sphereGeometry args={[5]}></sphereGeometry>
            <meshStandardMaterial fog={false} color={"white"}></meshStandardMaterial>
        </mesh>
    </group>
}
