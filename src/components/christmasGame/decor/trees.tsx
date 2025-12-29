import { CatmullRomCurve3, Color, DoubleSide, Euler, Vector3 } from 'three';
import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { IsInteractible } from '../../common/interactiveRender/IsInteractible.tsx';
import { CustomNormalMaterial } from '../../common/shaders/customNormal/CustomNormalMaterial.tsx';
import FakeGlowMaterial from '../../common/material/FakeGlowMaterial.tsx';
import Fireworks from '../../common/Fireworks.tsx';
import { Float, Sparkles } from '@react-three/drei';
import IntrinsicElements = React.JSX.IntrinsicElements;
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
            <TreeBall count={5} sparkling={animate}></TreeBall>

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
                </mesh>
            </group>
        </Float>)
    )
    return <group>{elements}</group>
}
export const Ornement = (props:{key:string}) => {


    return <group >   <mesh scale={[0.1, 0.2, 0.1]} position={[0,0.4,0]} >
        <octahedronGeometry args={[1,2 ]}></octahedronGeometry>

        <CustomNormalMaterial color1={new Color("cyan")}
                              color2={new Color("#87CEEB")}
                              color3={new Color("white")}

        ></CustomNormalMaterial>
    </mesh></group>
}
export const Ornement2 = (props:{key:string}) => {

    const [rotations, setRotations] = useState<Euler[]>(() => {


        const result = [];
        for (let i = 0; i < 4; i++) {
            result.push(new Euler(Math.random() * Math.PI/4 , Math.random() * Math.PI/4, Math.random() * Math.PI/4 ));
        }

        return result
    })


    const elements = rotations?.map((r, index) => (


            <group rotation={r} key={props.key+"-part-" + index} >


                <mesh scale={[0.1, 0.2, 0.1]} position={[0,0.4,0]} >
                    <octahedronGeometry args={[2, 0]}></octahedronGeometry>

                    <CustomNormalMaterial color1={new Color("cyan")}
                                          color2={new Color("#87CEEB")}
                                          color3={new Color("white")}

                    ></CustomNormalMaterial>
                </mesh>

                <mesh>
                    <sphereGeometry args={[0.3, 8, 8]}></sphereGeometry>
                    <meshStandardMaterial color={"yellow"} transparent={true} opacity={0}></meshStandardMaterial>

                </mesh>
            </group>
        )
    )
    return <group>{elements}</group>
}
export const Drop = (props: { position?: Vector3 }) => {
    return <group {...props} >
        <mesh scale={[0.1, 0.1, 0.2]}>
            <octahedronGeometry args={[2, 1]}></octahedronGeometry>

            <CustomNormalMaterial color1={new Color("cyan")}
                                  color2={new Color("#87CEEB")}
                                  color3={new Color("white")}

            ></CustomNormalMaterial>
        </mesh>

    </group>
}
