import React from 'react';
import { BufferGeometry, QuadraticBezierCurve3, Float32BufferAttribute, Shape, Vector2, Vector3 } from 'three';


export class  CustomTubeGeometry  extends BufferGeometry {
    constructor(
        path = new QuadraticBezierCurve3(
            new Vector3(-1, -1, 0),
            new Vector3(-1, 1, 0),
            new Vector3(1, 1, 0)
        ),
        tubularSegments = 64,
        shape = new Shape([new Vector2(1, 0), new Vector2(0, 1), new Vector2(-1, 0), new Vector2(0, -1)]), // Default: square
        closed = false
    ) {
        super();

        this.type = 'TubeGeometry';

        this.parameters = {
            path: path,
            tubularSegments: tubularSegments,
            shape: shape,
            closed: closed,
        };

        const frames = path.computeFrenetFrames(tubularSegments, closed);

        const normals = frames.normals;
        const binormals = frames.binormals;

        const vertex = new Vector3();
        const normal = new Vector3();
        const uv = new Vector2();
        let P = new Vector3();



        const vertices = [];
        const normalsArray = [];
        const uvs = [];
        const indices = []

        const shapePoints = shape.extractPoints(64).shape; // Extract shape vertices
        const shapeVertices = shapePoints.map((point) => new Vector3(point.x, point.y, 0));

        generateBufferData();
        this.setIndex(indices);
        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new Float32BufferAttribute(normalsArray, 3));
        this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));

        function generateBufferData() {


            for (let i = 0; i < tubularSegments; i++) {
                generateSegment(i);
            }

            generateSegment(closed === false ? tubularSegments : 0);

            generateUVs();
            generateIndices();

        }

        function generateIndices() {
            for (let j = 1; j <= tubularSegments; j++) {
                for (let i = 1; i <= shape.length; i++) {
                    const a = shape.length * (j - 1) + (i - 1);
                    const b = shape.length * j + (i - 1);
                    const c = shape.length * j + (i % shape.length);
                    const d = shape.length * (j - 1) + (i % shape.length);

                    indices.push(a, b, d);
                    indices.push(b, c, d);
                }
            }
        }

        function generateUVs() {
            for (let i = 0; i <= tubularSegments; i++) {
                for (let j = 0; j < shapeVertices.length; j++) {
                    uv.x = i / tubularSegments;
                    uv.y = j / shapeVertices.length;

                    uvs.push(uv.x, uv.y);
                }
            }

        }

        //TODO : customize for the tube
        function generateSegment( i:number ) {
            const P = path.getPointAt(i / tubularSegments);
            const N = normals[i];
            const B = binormals[i];

            for (let j = 0; j < shapeVertices.length; j++) {

                const shapeVertex = shapeVertices[j];

                const transformedVertex = new Vector3(
                    shapeVertex.x * N.x + shapeVertex.y * B.x,
                    shapeVertex.x * N.y + shapeVertex.y * B.y,
                    shapeVertex.x * N.z + shapeVertex.y * B.z
                );

                transformedVertex.add(P);

                vertices.push(transformedVertex.x, transformedVertex.y, transformedVertex.z);
                normalsArray.push(N.x, N.y, N.z);
            }

        }
    }
}


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
            <CustomTubeGeometry pathPoints={pathPoints} shapePoints={shapePoints} />
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.1, 16, 16]} ></sphereGeometry>
            </mesh>

        </>
    );
};

