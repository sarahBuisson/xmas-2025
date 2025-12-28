import { useTexture } from "@react-three/drei";
import { HeightfieldCollider, RigidBody } from "@react-three/rapier";
import { BufferGeometry, Color, CylinderGeometry, Matrix4, PlaneGeometry, Vector3 } from 'three';
import React, { forwardRef, ReactElement, useEffect, useImperativeHandle, useState } from 'react';
import { CSG } from 'three-csg-ts';
import { extend } from '@react-three/fiber';
import { CustomNormalMaterial } from "../common/material/CustomNormalMaterial.tsx";

export const Snow2 = forwardRef((props: {
    heightField: number[][],
    position?: Vector3,
    scale?:number,
    spriteMap?: ((v: Vector3) => ReactElement | string | undefined)[][]
} , ref) => {

    const [offsetPosition, setOffsetPosition] = React.useState<Vector3>(props.position as Vector3 || new Vector3(0, 0, 0));

    const [heightFieldWidth, setHeightFieldWidth] = useState(props.heightField[0].length);
    const [heightFieldHeight, setHeightFieldHeight] = useState(props.heightField.length);
    const [heightFieldGeometry, setHeightFieldGeometry] = useState<BufferGeometry>(new PlaneGeometry(
        heightFieldWidth,
        heightFieldHeight,
        heightFieldWidth - 1,
        heightFieldHeight - 1
    ));
    const [csg, setCsg] = useState<CSG>(() => {
        return CSG.fromGeometry(heightFieldGeometry)
    });


    useEffect(() => {

        const newHeightFieldGeometry = new PlaneGeometry(
            heightFieldWidth,
            heightFieldHeight,
            heightFieldWidth - 1,
            heightFieldHeight - 1
        );

        props.heightField.flatMap(it => it).forEach((v, index) => {
            newHeightFieldGeometry.attributes.position.array[index * 3 + 2] = v;
        });
        newHeightFieldGeometry.scale(1, -1, 1);
        newHeightFieldGeometry.rotateX(-Math.PI / 2);
        newHeightFieldGeometry.rotateY(-Math.PI / 2);
        newHeightFieldGeometry.translate(heightFieldWidth / 2, 0, heightFieldWidth / 2)
        newHeightFieldGeometry.computeVertexNormals();
        setHeightFieldGeometry(newHeightFieldGeometry);
        setCsg(CSG.fromGeometry(newHeightFieldGeometry));

    },[])

    const sprites: ReactElement[] = [];
    props.spriteMap?.forEach((row, y) => {
            row.forEach((spriteFunction, x) => {
                if (spriteFunction) {
                    if (typeof spriteFunction === 'function') {
                        const sprite = spriteFunction(new Vector3(y, props.heightField[y][x] + 0.5, x)) as ReactElement | undefined;
                        if (sprite)
                            sprites.push(sprite);
                    }
                } else {
                    if (spriteFunction) {
                        const texture = useTexture(spriteFunction!!);
                        sprites.push(<sprite key={`${x}-${y}`} position={[y, props.heightField[y][x] + 0.5, x]}
                                             scale={[1, 1, 1]}>
                            <spriteMaterial map={texture}/>
                        </sprite>);
                    }
                }

            });

        }
    )
    ;

    function addSnowHole(position: [number, number, number], radius: number) {
        console.log("Add snow hole at", position, "with radius", radius);
        const holeGeometry = new CylinderGeometry(0.5 * radius, 0.5 * radius, 10,);
        let computedY = position[1];
        holeGeometry.translate(position[0] - offsetPosition.x, computedY, position[2] - offsetPosition.z);
        const holeCsg = CSG.fromGeometry(holeGeometry);
        const newCsg = csg.subtract(holeCsg);
        const newGeometry = newCsg.toGeometry(new Matrix4());
        setHeightFieldGeometry(newGeometry);
        setCsg(CSG.fromGeometry(newGeometry));
    };

    useImperativeHandle(ref, () => ({addSnowHole}))

    return <RigidBody>
        <mesh geometry={heightFieldGeometry}
              material={ new CustomNormalMaterial( new Color(0xf2fcff), new Color(0xbfefff),new Color(0xffffff))}
              castShadow receiveShadow
              position={props.position}
              scale={props.scale ||1}>

        </mesh>
        <HeightfieldCollider
            position={new Vector3(heightFieldWidth / 2*(props.scale||1), -((props.scale||1))-1, heightFieldWidth / 2*(props.scale||1))}

            args={[
                heightFieldWidth - 1,
                heightFieldHeight - 1,
                props.heightField.flatMap(it => it),
                {x: heightFieldWidth*(props.scale||1), y: (props.scale||1), z: heightFieldHeight*(props.scale||1)}
            ]}
        />
    </RigidBody>
});
