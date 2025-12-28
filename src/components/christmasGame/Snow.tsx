import { BoxGeometry, BufferGeometry, CylinderGeometry, Matrix4, Vector3 } from 'three';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { CSG } from 'three-csg-ts';
import type { ThreeElements } from '@react-three/fiber';
import { HeightfieldCollider } from '@react-three/rapier';


function computeGeometry(geometry: BufferGeometry, computeTopYMethod = (x: number, y: number, z: number) => number) {
    const position = geometry.attributes.position;
   const newHeightMap= [];
    const heightCount = new Map<number, number>()
    for (let i = 0; i < position.count; i++) {
        const y = position.getY(i);
        if (!heightCount.has(y)) {
            heightCount.set(y, 1)
        } else {
            heightCount.set(y, heightCount.get(y)! + 1)
        }
    }
    console.log(heightCount)
    const maxHeight = Math.max(...Array.from(heightCount.keys()));

    // Déformez une face spécifique (par exemple, la face supérieure)
    for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const z = position.getZ(i);
        if (y >= maxHeight) {
            let newY = computeTopYMethod(x, y, z);
            position.setY(i, newY);
            newHeightMap.push(newY)
        }


    }
    position.needsUpdate = true;
    geometry.computeVertexNormals();
}

function extractHeightMap(geometry: BufferGeometry, width, width2): number[] {
    const position = geometry.attributes.position;
    const heightMap: number[] = [];
    const heightCount = new Map<number, number>();

    // Count occurrences of each Y value
    for (let i = 0; i < position.count; i++) {
        const y = position.getY(i);
        heightCount.set(y, (heightCount.get(y) || 0) + 1);
    }

    // Find the maximum Y value (top layer)
    const maxHeight = Math.max(...Array.from(heightCount.keys()));
    const min = Math.min(...Array.from(heightCount.keys()));

    // Extract heights for the top layer


    for(let x=0; x<width; x++){
        for (let z=0; z<width2; z++){
            heightMap[x + z * width]= (x + z * width);
        }
    }
    console.log("heightMap",heightMap, min, maxHeight)
    return heightMap;
}

export const Snow = forwardRef((props: {} & Omit<ThreeElements['mesh'], 'args'>, ref) => {
    console.log("Render Snow", props.position)
    const [offsetPosition, setOffsetPosition] = React.useState<Vector3>(props.position as Vector3 || new Vector3(0, 0, 0));
    let width = 50;
    let width2 = 50;
    let widthSegments = 20;
    let widthSegments2 = 20;
    const [geometry, setGeometry] = React.useState<BoxGeometry>(new BoxGeometry(width, 1, width2, widthSegments, 2, widthSegments2));
    const [csg, setCsg] = useState<CSG>(() => {
        return CSG.fromGeometry(geometry)
    });
    const [heightMap, setHeightMap] = useState<number[]>([]);
    console.log("Snow geometry")
    React.useEffect(() => {
        console.log("Snow props.position", props.position)
        const computeTopY = (x: number, y: number, z: number): number => {
            let computedX = 0.0 + x + offsetPosition?.x;
            let computedZ = 0.0 + z + offsetPosition?.z;
            let arg = 0.0 + computedX + (computedZ) / 1.2;
            let computeY = 0.0+y + Math.sin(arg) + Math.cos(computedZ);
            return computeY;
        }

        const newHeightMap= computeGeometry(geometry, computeTopY);
        setGeometry(geometry)
        setCsg(CSG.fromGeometry(geometry));

        const position = geometry.attributes.position;

        setHeightMap(extractHeightMap(geometry, widthSegments,widthSegments2));
    }, []);

    function addSnowHole(position: [number, number, number], radius: number) {
        console.log("Add snow hole at", position, "with radius", radius);
        const holeGeometry = new CylinderGeometry(0.5 * radius, 0.5 * radius, 10,);
        let computedY = position[1] - offsetPosition.y;
        holeGeometry.translate(position[0] - offsetPosition.x, computedY, position[2] - offsetPosition.z);
        const holeCsg = CSG.fromGeometry(holeGeometry);
        const newCsg = csg.subtract(holeCsg);
        const newGeometry = newCsg.toGeometry(new Matrix4()).geometry as BoxGeometry;
        setCsg(newCsg);
        setGeometry(newGeometry);
    };

    useImperativeHandle(ref, () => ({addSnowHole}))

    return (
        <>
            <mesh geometry={geometry} position={[0, 0, -2]} castShadow receiveShadow>
                <meshStandardMaterial color={"white"} side={2} transparent={true} opacity={0.8}/>
            </mesh>
            {false && heightMap?.length > 0 ? <HeightfieldCollider  args={[
                widthSegments -1,
                widthSegments2-1 ,
                heightMap,
                {x: width, y:1,z:width2}
            ]}></HeightfieldCollider>:<></> }
        </>
    )
});
