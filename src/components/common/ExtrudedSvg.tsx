import { useLoader } from "@react-three/fiber";
import React, { useMemo } from "react";
import { Color, DoubleSide, Shape } from "three";
import { SVGLoader } from 'three-stdlib'
import FakeGlowMaterial from './material/FakeGlowMaterial.tsx';

type  ExtrudedSvgProps = {
    svgPath: string,
    idInSvg?: string,
    maxWidth?: number,
    group?: any,
    customProcess?: (shape: Shape[], index: number, svgdata: any) => any
    customProcessMaterial?: (shape: Shape[], index: number, svgdata: any) => any
    symmetric?: boolean
}
const ExtrudedSvg = (props: ExtrudedSvgProps) => {
    const {
        customProcess = () => {
            return {
                depth: 2,
                bevelEnabled: true,
                steps: 1,
            }
        },
        customProcessMaterial = (shape: Shape[], shapeIndex: number, svgData: any) => {
            return

            <meshPhongMaterial
                attach="material"

                color={(svgData.paths[shapeIndex].color.add(new Color(2, 0, 0)))}


            ></meshPhongMaterial>
        },

    } = props;
    const svgData = useLoader(SVGLoader, props.svgPath);
    const shapes =
        useMemo(() => {

            if (props.idInSvg) {

                const group = svgData.paths.filter((path: any) => path?.userData?.node?.parentNode.id == props.idInSvg);


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
                    return (<group>
                            <mesh key={shapeIndex} rotation={[0, Math.PI / 2, 0]}>
                                <extrudeGeometry
                                    args={[
                                        shape,
                                        customProcess(shape, shapeIndex, svgData)
                                        ,
                                    ]}
                                />
                                {customProcessMaterial(shape, shapeIndex, svgData)}

                            </mesh>
                            {props.symmetric && (
                                <mesh key={shapeIndex + "-sym"}  scale={[1, 1, -1]}  rotation={[0, Math.PI / 2, 0]}>
                                    <extrudeGeometry
                                        args={[
                                            shape,
                                            customProcess(shape, shapeIndex, svgData)
                                            ,
                                        ]}
                                    />
                                    {customProcessMaterial(shape, shapeIndex, svgData)}

                                </mesh>
                            )}

                        </group>
                    );
                })})
            </mesh>
        </>
    );
};

export default ExtrudedSvg;
