import React, { useMemo } from 'react';
import { CatmullRomCurve3, ExtrudeGeometry, Shape, Vector3 } from 'three';

const CustomTube = ({pathPoints, shapePoints}) => {
    console.log('Rendering CustomTube with pathPoints:', pathPoints, 'and shapePoints:', shapePoints);
    const geometry = useMemo(() => {
        console.log('Generating geometry with pathPoints:', pathPoints, 'and shapePoints:', shapePoints);
        // Define the path
        const path = new CatmullRomCurve3(
            pathPoints.map(([x, y, z]) => new Vector3(x, y, z))
        );

        // Define the custom shape
        const shape = new Shape();
        shapePoints.forEach(([x, y], index) => {
            console.log('Saving shape point:', x, y);
            if (index === 0) {
                shape.moveTo(x, y);
            } else {
                shape.lineTo(x, y);
            }
        });
        shape.closePath();

        // Create the extruded geometry
        return new ExtrudeGeometry(shape, {
            steps: 2,
            extrudePath: path,
            bevelEnabled: false,
        });
    }, [pathPoints, shapePoints]);

    return (
        <mesh geometry={geometry}>
            <meshStandardMaterial color="orange"/>
        </mesh>
    );
};

export const CustomTubeDemoApp = () => {
    const pathPoints = [
        [0, 0, 0],
        [1, 2, 0],
        [2, 3, 1],
        [3, 2, 0],
        [4, 0, 0],
    ];

    const shapePoints = [
        [0, 0],
        [0.5, 0],
        [0.5, 0.5],
        [0, 0.5],
    ]; // Example: square shape

    return (
        <>

            <ambientLight intensity={0.5}/>
            <CustomTube pathPoints={pathPoints} shapePoints={shapePoints} />
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.1, 16, 16]} ></sphereGeometry>
            </mesh>

        </>
    );
};

