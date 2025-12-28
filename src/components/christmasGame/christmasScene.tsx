import { Physics, RigidBody } from '@react-three/rapier';
import { AnimateSpiralGeometry, Drop, Moon, Ornement, } from './decor/decors.tsx';
import React, { useEffect, useRef } from 'react';
import { Glow } from '../common/shaders/glow/glow.tsx';
import { extend } from '@react-three/fiber';
import { CatmullRomCurve3, Euler, Vector3 } from 'three';
import { Snow2 } from './Snow2.tsx';
import { Snow } from './Snow.tsx';
import { Labyrinth } from '../../service/labGenerator.tsx';
import { Kase2D } from '../../service/tableau.ts';
import { HexagonalTableauBis } from './service.ts';
import { MoveOnClickWrapper } from '../common/interactiveRender/MoveOnClick.tsx';
import { FPSPlayer } from '../common/player/FPSPlayer.tsx';
import { random } from '../../service/utils.ts';
import { ProgressiveAppear } from '../common/interactiveRender/ProgressiveAppear.tsx';
import { Environment } from '@react-three/drei';
import { IsInteractible } from '../common/interactiveRender/IsInteractible.tsx';
import { RandomCircleDistribution } from '../common/RandomCircleDistribution.tsx';
import { SoundPlayer } from '../common/services/SoundPlayer.tsx';
import { Home } from './decor/Home.tsx';
import { StartZone } from './decor/StartZone.tsx';
import { calculateLookAtRotation } from '../../service/vectorCompute.ts';
import { Wind } from './decor/Wind.tsx';

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
let labSize = 10;
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
const hexaSize = 30;

function kaseToVector(kase: Kase2D) {
    return new Vector3(kase.x * hexaSize, 0, (kase.x * 0.5 + kase.y) * hexaSize);
}

export function ChristmasScene() {

    const [previousPrint, setPreviousPrint] = React.useState<Vector3>();
    const snowRef = React.useRef<any | undefined>(null);
    const [content, setContent] = React.useState<JSX.Element[] | null>(null);
    const [contentMap, setContentMap] = React.useState<Map<string, JSX.Element>>(new Map());

    const soundPlayerRef = useRef<{ playSound: (url: string) => void, stopSound: (url: string) => void }>(null);
    const playerRef = useRef<{ playSound: (url: string) => void, stopSound: (url: string) => void }>(null);

    // debut partie neige
    function playerMove(position: Vector3, direction: Vector3) {
        console.log("Player moved to:", position);
        if (!previousPrint || position.distanceTo(previousPrint) > 0.5) {
            console.log("Player position:", position, snowRef);

            setPreviousPrint(position);
            snowRef.current?.addSnowHole([position.x, position.y, position.z], 1);
        }
    }

    let snow = <Snow2 ref={snowRef} heightField={snowheightField} scale={20} position={new Vector3(0, -30, 0)}></Snow2>;
    snow = <Snow ref={snowRef}></Snow>;
//fin partie neige

    // debut partie labyrinth
    function addToContent(toAdd) {
        console.log("add", toAdd)
        setContent((oldContent) => {
            return (oldContent || []).concat([toAdd]);
        })
        if (toAdd.props.position) {
            contentMap.set(toAdd.props.position.toString(), toAdd)
        }else if(toAdd.key){
            contentMap.set(toAdd.key, toAdd)
        }
        setContentMap((oldMap) => {

            const newMap = new Map(oldMap)

            if (toAdd.props.position) {
                newMap.set(toAdd.props.position, toAdd)
            }else if(toAdd.key){
                newMap.set(toAdd.key, toAdd)
            }

            return newMap;
        })
    }

    function computeBallsOfKase(kase: Kase2D, points: Vector3[]) {
        console.log(kase.connections)
        return kase.connections.map((conn, index) => {
            const connection = l.tableau.neighborAt2(kase, conn) as ChrisKase;
            if (!connection) return null;
            const directionConnection = kaseToVector(connection).sub(kaseToVector(kase)).normalize()//.multiplyScalar(2);

            let computeBallPosition: Vector3 = new Vector3()// kaseToVector(kase).add(computeSpiralPoint(points,turns, radius, offset, height))

            computeBallPosition = kaseToVector(kase).add(directionConnection)//.add(new Vector3(0, 2, 0))
            if (points.length > 2){
                computeBallPosition = kaseToVector(kase).add(random(points))
            }


            let trajectory = new CatmullRomCurve3([computeBallPosition, computeBallPosition.clone().add(new Vector3(0, 2, 0)), kaseToVector(connection).add(new Vector3(0, 1, 0))]);

            return <group key={"ball"+computeBallPosition.x+"/"+computeBallPosition.y+"/"+computeBallPosition.z}>

                        <MoveOnClickWrapper
                                            trajectory={trajectory}


                                            callOnStart={() => {
                                                connection.discovered = true;
                                                soundPlayerRef.current?.playSound("./sound/firecracker.wav");
                                            }}
everyInterval={1}
                                            callEvery={(currentPos)=>{
                                                console.log("drop")
                                                    addToContent(<RigidBody position={currentPos} rotation={new Euler(0, Math.random(),0)}>
                                                   <Drop ></Drop></RigidBody>)
                                            }}
                                            callOnEnd={() => {
                                                connection.discovered = true;
                                                console.log("call on end")
                                                addToContent(generateTree(connection));
                                                soundPlayerRef.current?.playSound("./sound/firecracker.wav");
                                            }}

                        >
                            <ProgressiveAppear>
                                <group scale={0.3}>
                                    <Ornement></Ornement>

                                </group>
                            </ProgressiveAppear>
                        </MoveOnClickWrapper>


               </group>
        }).filter(it=>it!=null)
    }

    function generateTree(kase: Kase2D) {
        console.log("generateTree", kase)
        return <AnimateSpiralGeometry
            radius={1.2} height={2.4} turns={4}

            position={kaseToVector(kase).add(new Vector3(0, 1, 0))}
            onAnimateComplete={(points) => {
                let balls = computeBallsOfKase(kase, points);
                console.log("balls",balls)
                balls.forEach(addToContent)
                soundPlayerRef.current?.stopSound("./sound/firecracker.wav");


            }}
            onAnimateStart={() => {
                soundPlayerRef.current?.playSound("./sound/firecracker.wav");
            }}
        ></AnimateSpiralGeometry>;
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
                console.log(computedPosition)
                if (!kase.connections.includes(neighbor.positionKey())) {
                    const wind =<Wind position={computedPosition}
                                      sizeWind={hexaSize/3}
                                      rotation={calculateLookAtRotation(kasePosition, neiPos)}></Wind>
                    addToContent(wind)
                } else {
                    if (!neighbor) {
                        console.error("no nei", kase);
                        return
                    }
                    console.warn("wind")


                }
            })
        })
        console.log("fin initScene", contentMap)
    }

    useEffect(initScene, [])
    //fin partie labyrinth
    console.log(contentMap)
    return <>
        <SoundPlayer ref={soundPlayerRef}/>

        <Environment background files="mountainNight.jpg"/>
        <fogExp2 attach="fog" color="darkblue" density={0.05} />
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
            <FPSPlayer position={kaseToVector(kaseStart).add(new Vector3(2, 5, 0))} ref={playerRef}></FPSPlayer>


        </Physics>
        <StartZone position={kaseToVector(kaseStart)}></StartZone>
        <RandomCircleDistribution position={new Vector3(0, 0, 0)}

                                  radius={hexaSize * labSize}
                                  count={hexaSize * labSize / 2}>
            <mesh>
                <octahedronGeometry args={[hexaSize * Math.random() * 2, 0]}></octahedronGeometry>
            </mesh>
        </RandomCircleDistribution>

        <RandomCircleDistribution position={new Vector3(0, 0, 0)}
                                  radius={hexaSize * labSize * 2} count={4}>
            <mesh>
                <octahedronGeometry args={[16 + hexaSize * 2, 0]}></octahedronGeometry>
            </mesh>
        </RandomCircleDistribution>
        <Moon position={new Vector3(10, 30, 20)}
              onPointerDown={() => {
                  console.log("moon cli",playerRef)
                  if (playerRef?.current) playerRef!!.current!!.position!!.y += 1;
              }}>

        </Moon>
    </>;
}
