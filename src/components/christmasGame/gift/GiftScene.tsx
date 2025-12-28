import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier';
import React, { JSX, useEffect } from 'react';
import { HexagonalTableau, Kase2D } from '../../../service/tableau.ts';
import { Labyrinth } from '../../../service/labGenerator.tsx';
import { HexagonalTableauBis } from '../service.ts';
import { GiftBox } from '../decor/decors.tsx';
import { PointLightHelper, Vector3 } from 'three';
import { FPSPlayer } from '../../common/player/FPSPlayer.tsx';
import { Helper, PointerLockControls, useTexture } from '@react-three/drei';
import { calculateLookAtRotation } from '../../../service/vectorCompute.ts';
import { extend } from '@react-three/fiber';
import { SuperflatBisMaterial, SuperflatMaterial } from '../../common/shaders/superflatMaterial/superflatMaterial.tsx';


const invRec3 = 1.0 / Math.sqrt(3);
const hexaRadius = 5.0
function getPositionFromXY(x:number,y:number): Vector3 {
    return new Vector3(x * 1.5 * hexaRadius, 0, (x * 0.5 + y) / invRec3 * hexaRadius)
}
function getPositionFromKase(kase: Kase2D): Vector3 {
    return getPositionFromXY(kase.x, kase.y);
}

const labSize = 10;
let kses: Kase2D[][] = [];
for (let i = 0; i < labSize; i++) {
    kses[i] = []
    for (let j = 0; j < labSize; j++) {
        kses[i][j] = new Kase2D(i, j)
    }
}
let l = new Labyrinth(new HexagonalTableau(kses));
//l.connectStar(l.tableau.getKase(2,2)!!)
l.fillLab()
console.log(l)

function randomOf<T>(wallMats: T[]):T {
    return wallMats[Math.floor(Math.random()*wallMats.length)];
}
extend({SuperflatBisMaterial})
export function GiftScene() {
    const plumeTexture = useTexture("./greenPlume.png");
    const wtexture = useTexture("./ivoryLeather.jpg");
    const ctexture = useTexture("./copper.jpg");
    const [boxes, setBoxes] = React.useState<JSX.Element[]>([])
    const [wallMats, setWallMat] = React.useState([<meshStandardMaterial color={"orange"}></meshStandardMaterial>,
        <meshStandardMaterial color={"red"}></meshStandardMaterial>,
        <superflatBisMaterial uTexture={plumeTexture} fogColor={"white"} ratioY={1.5}></superflatBisMaterial>,
        <superflatBisMaterial uTexture={wtexture} fogColor={"white"} ratioY={1.5}></superflatBisMaterial>,
        <superflatBisMaterial uTexture={ctexture} fogColor={"white"} ratioY={1.5}></superflatBisMaterial>])
    const [edgeMat, setEdgeMat] = React.useState(<meshStandardMaterial color={"brown"}></meshStandardMaterial>)
    const [groundMat, setGroundMat] = React.useState(<meshStandardMaterial color={"blue"}></meshStandardMaterial>)

    useEffect(() => {
        console.log("lab to gift")

        const content: JSX.Element[] = []

        l.tableau.allKases().forEach((kase, index) => {


            let kasePosition = getPositionFromKase(kase);
            content.push(<GiftBox position={kasePosition}
                                  paperMaterial={groundMat}
                                  onPointerDown={() => console.log("clixk")}

                                  sizes={[2.0 + Math.random(), 0.1, 2.0 + Math.random()]}
                                  rotation={[0, Math.random() * Math.PI * 2, 0]}
                                  key={"fullKase" + index}></GiftBox>)

            if (kase.connections.length <= 1) {
                content.push(<GiftBox position={kasePosition}
                                      paperMaterial={randomOf(wallMats)}

                                      sizes={[2.0 + Math.random(), 0.30, 2.0 + Math.random()]}
                                      rotation={[0, Math.random() * Math.PI * 2, 0]}
                                      key={"culdeSac" + index}></GiftBox>)
            } ;
            if(true){


                l.tableau.neighbors(kase).forEach((neighborKase) => {
                    if (!kase.connections.includes(neighborKase.positionKey())) {

                        let computedPosition = (getPositionFromKase(neighborKase).add(kasePosition)).multiplyScalar(0.5);
                        console.log("wall", computedPosition)
                        content.push(<GiftBox position={computedPosition}
                                              paperMaterial={randomOf(wallMats)}
                                              sizes={[ hexaRadius + Math.random(),2.0 + Math.random(),1]}
                                              rotation={calculateLookAtRotation(computedPosition, getPositionFromKase(neighborKase))}
                                              key={"wall" + index + "-" + kase.x + "-" + kase.y}></GiftBox>)

                    } else {
                        let computedPosition = (getPositionFromKase(neighborKase).add(kasePosition)).multiplyScalar(0.5);
                        console.log("pathConnected", computedPosition)
                        content.push(<GiftBox position={computedPosition}
                                              paperMaterial={groundMat}
                                              sizes={[1, 0.5,hexaRadius + Math.random()]}
                                              rotation={calculateLookAtRotation(computedPosition, getPositionFromKase(neighborKase))}
                                              key={"path" + index + "-" + kase.x + "-" + kase.y}></GiftBox>)

                    }

                })


            }
            l.tableau.getAllDirections()
                .forEach((direction, dirIndex) => {
                    const vectorDirection=getPositionFromXY(direction.x, direction.y);
                    if (!l.tableau.neighborAt(kase, direction.x, direction.y)) {
                        // si un voisin n'existe pas on place un cadeau au bord

                        let computedPosition = (new Vector3().add(kasePosition).add(vectorDirection.multiplyScalar(0.5)));
                        console.log("edge gift", computedPosition   ,kasePosition)
                        let rotation = calculateLookAtRotation(computedPosition, kasePosition);
                        content.push(<GiftBox position={computedPosition}
                                              paperMaterial={randomOf(wallMats)}
                                              sizes={[ hexaRadius+ Math.random(), 3.0 + Math.random(),1]}
                                              rotation={rotation}
                                              key={"edge" + index + "-" + computedPosition.x + "-" + computedPosition.y}></GiftBox>)

                    }
                })
            setBoxes(content)
            console.log(content)
        })
    }, [])
    return <>


        <ambientLight intensity={1}></ambientLight>
        <mesh position={[2, 0, 0]}>
            <sphereGeometry></sphereGeometry>
            <meshStandardMaterial color={'red'}></meshStandardMaterial>
        </mesh>
        <Physics debug={true}>

            <RigidBody type="fixed"
                       friction={0.5}
                       colliders={false}>
                <mesh receiveShadow position={[10, -5, 10]} rotation-x={-Math.PI / 2}>
                    <planeGeometry args={[1000, 1000]}/>
                    <meshStandardMaterial color="green"/>
                </mesh>
                <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]}/>
            </RigidBody>
            <Helper type={PointLightHelper} args={[10, "red"]}/>
            <PointerLockControls/>
            <FPSPlayer></FPSPlayer>
            {boxes}
        </Physics>
    </>;
}
