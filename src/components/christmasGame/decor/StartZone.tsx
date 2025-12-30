import { Center, PositionalAudio, Text, Text3D } from '@react-three/drei';
import { GLBGeometry } from '../../common/GlbGeometry.tsx';
import { Euler, Vector3 } from 'three';
import React from 'react';


export function MessageBoard(props: {
    text: string,
    position?: Vector3,
    rotation?: Euler
}) {
    return <group {...props}>
        <group scale={0.01}>
            <mesh position={[0, 0, 0]}>
                <GLBGeometry modelPath={"./christmas/sign.glb"} scale={0.1}></GLBGeometry>
                <meshStandardMaterial color={"red"}></meshStandardMaterial>
            </mesh>
        </group>
        <Center position={[0, 1.8, 0.2]}>
            <Text3D font={"./fonts/default.json"} size={0.1} height={0} >
                {props.text}
                <meshStandardMaterial color={"lightblue"}></meshStandardMaterial>
            </Text3D>
        </Center>

    </group>;
}

export function StartZone(props: { position?: Vector3 }) {
    return <group {...props}>

        <MessageBoard
            position={new Vector3(7, -1, 1)}

            text={"Move with arrays/WASD keys\nclick to interact"}>

        </MessageBoard>
        <MessageBoard
            position={new Vector3(8, -0.5, -3)}
            rotation={new Euler(0, - 1* Math.PI / 4, 0)}

            text={"Maze aren't about walls\nIt's about path"}>

        </MessageBoard>
        <MessageBoard
            position={new Vector3(7, 0.2, 2)} rotation={new Euler(0, -Math.PI / 3, -Math.PI * 1.5 / 9)}
            text={"Go find the meaning\n of Christmas"}>

        </MessageBoard>


        <PositionalAudio  url="./sound/wind.mp3"
                          distance={10} play={true}
                          position={[0,0,0]}
                          loop></PositionalAudio>
    </group>
}
