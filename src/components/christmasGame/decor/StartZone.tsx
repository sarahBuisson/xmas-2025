import { GLBModel } from '../../common/GlbModel.tsx';
import { Text } from '@react-three/drei';
import { GLBGeometry } from '../../common/GlbGeometry.tsx';
import type { Vector3 } from 'three';

export function StartZone(props: { position?: Vector3 }) {
    return <group {...props}>
        <group rotation={[0, -3 * Math.PI / 4, 0]} position={[0, 0, 5]}>
            <group position={[0, 0.5, 0]} rotation={[0, -Math.PI / 3, Math.PI / 8]}>
                <group scale={0.01}>
                    <mesh position={[0, 0, 0]}>
                        <GLBGeometry modelPath={"./christmas/sign.glb"} scale={0.1}></GLBGeometry>
                        <meshStandardMaterial color={"brown"}></meshStandardMaterial>
                    </mesh>
                </group>
                <Text position={[0, 2, 0.2]} scale={0.2}> a maze isn't about walls
                </Text>
                <Text position={[0, 1.8, 0.2]} scale={0.2}>
                    It's about path</Text>
            </group>
            <group position={[1, 0.2, 1]} rotation={[0, -Math.PI / 3, -Math.PI * 1.5 / 9]}>
                <group scale={0.01}>
                    <mesh position={[0, 0, 0]}>
                        <GLBGeometry modelPath={"./christmas/sign.glb"} scale={0.08}></GLBGeometry>
                        <meshStandardMaterial color={"brown"}></meshStandardMaterial>
                    </mesh>
                </group>
                <Text position={[0, 1.6, 0.2]} scale={0.1}> find the meaning</Text>
                <Text position={[0, 1.4, 0.2]} scale={0.1}> of christmas</Text>
            </group>
        </group>
    </group>
}
