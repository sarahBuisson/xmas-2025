import { BallCollider, Physics, RigidBody } from '@react-three/rapier';
import { BackgroundMountains, Moon, } from './decor/decors.tsx';
import React, { Suspense, useEffect, useRef } from 'react';
import { Glow } from '../common/shaders/glow/glow.tsx';
import { extend } from '@react-three/fiber';
import { CatmullRomCurve3, Color, Euler, Vector3 } from 'three';
import { Labyrinth } from '../../service/labGenerator.tsx';
import { Kase2D } from '../../service/tableau.ts';
import { HexagonalTableauBis } from './service.ts';
import { MoveOnClickWrapper } from '../common/interactiveRender/MoveOnClick.tsx';
import { FPSPlayer } from '../common/player/FPSPlayer.tsx';
import { random } from '../../service/utils.ts';
import { ProgressiveAppear } from '../common/interactiveRender/ProgressiveAppear.tsx';
import { Environment, Points, PointMaterial, Point } from '@react-three/drei';
import { SoundPlayer } from '../common/services/SoundPlayer.tsx';
import { Home } from './decor/Home.tsx';
import { StartZone } from './decor/StartZone.tsx';
import { calculateLookAtRotation } from '../../service/vectorCompute.ts';
import { Wind } from './decor/Wind.tsx';
import { CustomNormalMaterial } from '../common/shaders/customNormal/CustomNormalMaterial.tsx';
import { hexaSize, labSize } from './constant.tsx';
import { AnimateSpiralGeometry, Ornement } from './decor/trees.tsx';
import { DistanceDisplayWrapper } from '../common/interactiveRender/DistanceDisplayWrapper.tsx';
import FakeGlowMaterial from '../common/material/FakeGlowMaterial.tsx';

extend({Glow})


const snowheightField: number[][] = [[1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1],
    [1, 2, 1, 1, 1],
    [1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1]

];

class ChrisKase extends Kase2D {
    discovered = false;

    constructor(x: number, y: number) {
        super(x, y);
    }
}

let kses: Kase2D[][] = [];

for (let i = -labSize / 2; i < labSize / 2; i++) {
    kses[i] = []
    for (let j = -labSize / 2; j < labSize / 2; j++) {
        kses[i][j] = new ChrisKase(i, j)
    }
}
let l = new Labyrinth(new HexagonalTableauBis(kses));
let kaseStart = random(l.tableau.allKases() as ChrisKase[]);
l.connectCorridor(kaseStart);
let kaseEnd = l.getCulDeSacs().find((kase) => kase !== kaseStart);


function kaseToVector(kase: Kase2D) {
    return new Vector3(kase.x * hexaSize, 0, (kase.x * 0.5 + kase.y) * hexaSize);
}

export function ChristmasScene() {
    const [contentMap, setContentMap] = React.useState<Map<string, JSX.Element>>(new Map());

    const soundPlayerRef = useRef<{ playSound: (url: string) => void, stopSound: (url: string) => void }>(null);
    const playerRef = useRef<{ playSound: (url: string) => void, stopSound: (url: string) => void }>(null);


//fin partie neige

    // debut partie labyrinth
    function addToContent(toAdd: any, key?: string, replaceIfExists = true) {
let computedKey = key;
        if (!computedKey)
           if (toAdd.key) {
               computedKey=toAdd.key
            }else  if (toAdd.props.position) {
               computedKey = toAdd.props.position.x + "/" + toAdd.props.position.y + "/" + toAdd.props.position.z;
           } else{
               computedKey="key"+Math.random()
           }

        if (replaceIfExists) {
            contentMap.set(computedKey, toAdd)
        } else {
            if (!contentMap.has(computedKey)) {
                contentMap.set(computedKey, toAdd)
            }
        }
        setContentMap((oldMap) => {

            const newMap = new Map(oldMap)
            if (replaceIfExists) {
                newMap.set(computedKey, toAdd)
            } else {
                if (!newMap.has(computedKey)) {
                    newMap.set(computedKey, toAdd)
                }
            }
            return newMap;
        })
    }

    function removeToContent(toRemove) {
        console.log("remove", toRemove)

        const key = contentMap.entries().filter(([k, v]) => v === toRemove).next().value?.[0];
        removeKeyToContent(key)
    }

    function removeKeyToContent(key: string) {

console.log("remove", key)
        setContentMap((oldMap) => {

            const newMap = new Map(oldMap)


            newMap.delete(key)
            oldMap.delete(key)


            return newMap;
        })
        contentMap.delete(key)

    }

    function computeBallsOfKase(kase: Kase2D, points: Vector3[]) {
        console.log(kase.connections)
        return kase.connections.map((conn, index) => {
            const connection = l.tableau.neighborAt2(kase, conn) as ChrisKase;
            if (!connection) return null;
            const directionConnection = kaseToVector(connection).sub(kaseToVector(kase)).normalize()//.multiplyScalar(2);

            let computeBallPosition: Vector3 = new Vector3()// kaseToVector(kase).add(computeSpiralPoint(points,turns, radius, offset, height))

            computeBallPosition = kaseToVector(kase).add(directionConnection)//.add(new Vector3(0, 2, 0))
            if (points.length > 2) {
                console.log("use points")
                computeBallPosition = kaseToVector(kase).add(random(points)).add(new Vector3(0, 0.52, 0))
            } else {
                console.error("dont use points", points)
            }


            let trajectory = new CatmullRomCurve3([computeBallPosition, computeBallPosition.clone().add(new Vector3(0, 1, 0)), kaseToVector(connection).add(new Vector3(0, 1, 0))]);

            let keyBall = "ball" + computeBallPosition.x + "/" + computeBallPosition.y + "/" + computeBallPosition.z;
            return <group
                key={keyBall}>

                <MoveOnClickWrapper
                    trajectory={trajectory}


                    callOnStart={() => {
                        connection.discovered = true;
                        soundPlayerRef.current?.playSound("./sound/crystal-chimes.wav");
                    }}
                    everyInterval={0.8}
                    callEvery={(currentPos) => {
                        addToContent(<RigidBody position={currentPos.add(new Vector3(Math.random()*0.1, 0, Math.random()))}
                                                rotation={new Euler(0, Math.random()*Math.PI*2, 0)} linearVelocity={[0,2,0]}
                                                scale={0.5} key={keyBall + "particle" + Math.random()} >
                            <BallCollider args={[0.1]}/>
                            <mesh>
                                <sphereGeometry args={[0.1, 16, 16]}></sphereGeometry>
                                <meshStandardMaterial color={"white"}></meshStandardMaterial>
                                <FakeGlowMaterial glowColor={"cyan"} opacity={0.5} ></FakeGlowMaterial>
                            </mesh>
                        </RigidBody>)
                    }}
                    callOnEnd={() => {
                        connection.discovered = true;
                        console.log("call on end")
                        let tree = generateTree(connection);
                        addToContent(tree);
                        removeKeyToContent(keyBall)
                        soundPlayerRef.current?.stopSound("./sound/crystal-chimes.wav");
                    }}

                >
                    <ProgressiveAppear>
                        <group scale={1}>
                            <Ornement key={kase.positionKey() + "ornement" + index}
                            ></Ornement>

                        </group>
                    </ProgressiveAppear>
                </MoveOnClickWrapper>


            </group>
        }).filter(it => it != null)
    }

    function generateTree(kase: Kase2D) {
        console.log("generateTree", kase)
        return <DistanceDisplayWrapper position={kaseToVector(kase).add(new Vector3(0, 1, 0))}><AnimateSpiralGeometry
            radius={1.2} height={2.4} turns={4}


            onAnimateComplete={(points) => {
                let balls = computeBallsOfKase(kase, points);
                console.log("balls", balls)
                balls.forEach(addToContent)
                soundPlayerRef.current?.stopSound("./sound/firecracker.wav");


            }}
            onAnimateStart={() => {
                soundPlayerRef.current?.playSound("./sound/firecracker.wav");
            }}
        ></AnimateSpiralGeometry></DistanceDisplayWrapper>;
    }

    function initScene() {
        console.log("initScene")
        let trees = generateTree(kaseStart)
        addToContent(trees)
        addToContent(<Home position={kaseToVector(kaseEnd!!)}></Home>)

        //wind
        l.tableau.allKases().forEach((kase) => {
            let kasePosition = kaseToVector(kase);
            l.tableau.neighbors(kase).forEach((neighbor) => {
                let neiPos = kaseToVector(neighbor!!);
                const computedPosition = (neiPos.add(kasePosition)).multiplyScalar(0.5);
                if (!kase.connections.includes(neighbor.positionKey())) {
                    if (Math.random() > 0.5) {
                        const wind =
                            <DistanceDisplayWrapper position={computedPosition} maxDistance={hexaSize*2}>
                            <Wind sizeWind={hexaSize / 3}
                                  rotation={calculateLookAtRotation(kasePosition, neiPos)}></Wind>
                        </DistanceDisplayWrapper>
                        addToContent(wind);

                    }
                } else {
                    if (!neighbor) {
                        console.error("no nei", kase);
                        return
                    }


                }
            })
        })
    }

    useEffect(initScene, [])
    //fin partie labyrinth
    return <>
        <SoundPlayer ref={soundPlayerRef}/>

        <Environment background files="mountainNight.jpg"/>
        <fogExp2 attach="fog" color="darkblue" density={0.05}/>
        <ambientLight intensity={0.2}></ambientLight>

        <pointLight intensity={1.5} position={[0, 25, 0]} castShadow></pointLight>
        <pointLight intensity={1.5} position={[0, 5, 0]} castShadow></pointLight>
        <pointLight intensity={1.5} position={[0, 50, 0]} castShadow></pointLight>
        <pointLight intensity={1.5} position={[0, -50, 0]} castShadow></pointLight>
        <directionalLight
            position={[-2, 8, -3]}
            intensity={1}
            castShadow

        />

        <Physics>
            <RigidBody type="fixed"
                       friction={0.5}>
                <mesh receiveShadow position={[0, 0, 0]}>
                    <boxGeometry args={[labSize * hexaSize * 2, 1, labSize * hexaSize * 2]}></boxGeometry>
                    <meshStandardMaterial color={"white"} transparent={true} opacity={1}></meshStandardMaterial>
                </mesh>

            </RigidBody>
            {contentMap.values()}
            <FPSPlayer position={kaseToVector(kaseStart).add(new Vector3(2, 4, 3))}
                       ref={playerRef}></FPSPlayer>


        </Physics>
        <Suspense>
            <StartZone position={kaseToVector(kaseStart)}></StartZone>
        </Suspense>
        <BackgroundMountains></BackgroundMountains>
        <Moon position={new Vector3(10, 30, 20)}
              onPointerDown={() => {
                  console.log("moon cli", playerRef)
                  if (playerRef?.current) playerRef!!.current!!.position!!.y += 1;
              }}>

        </Moon>

    </>;
}
