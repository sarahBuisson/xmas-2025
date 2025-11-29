import { useLoader } from "@react-three/fiber";
import  { useMemo } from "react";
import * as T from "three";
import { Color } from "three";import { SVGLoader } from 'three-stdlib'

type  ExtrudedSvgProps = {
    svgPath: string,
    idInSvg?: string,
    maxWidth?: number,
    group?: any,
}
const ExtrudedSvg = (props: ExtrudedSvgProps) => {
    const svgData = useLoader(SVGLoader, props.svgPath);
    const shapes =
        useMemo(() => {

            if (props.idInSvg) {

                const group = svgData.paths.filter((path:any) => path?.userData?.node?.parentNode.id == props.idInSvg);


                if (!props.group || props.group.length == 0) {
                    console.warn(`Group with ID "${props.idInSvg}" not found in SVG.`);
                    return [];
                }
                return group.map(it => it.toShapes(true));

            } else {

                return svgData.paths.map((p) => p.toShapes(true));

            }

        }, [svgData, props.idInSvg]);


    return (
        <>


            <mesh {...props}>
                {shapes.map((shape, shapeIndex: number) => {

                    return (
                        <mesh key={shapeIndex} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                            <extrudeGeometry
                                args={[
                                    shape,
                                    {
                                        depth: 1,
                                        bevelEnabled: true,
                                        steps: 1,
                                    },
                                ]}
                            />
                            <meshPhongMaterial
                                attach="material"
                                color={svgData.paths[shapeIndex].color.add(new Color(2, 0, 0))}
                                side={T.DoubleSide}
                            />
                        </mesh>
                    );
                })})
            </mesh>
        </>
    );
};

export default ExtrudedSvg;
