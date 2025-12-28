import { Helper, PerspectiveCamera, PointerLockControls, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RapierRigidBody, RigidBody, useRapier, } from "@react-three/rapier";
import React, { useRef } from "react";
import * as RAIPER from "@dimforge/rapier3d-compat";
import * as THREE from "three";
import { PointLightHelper, Vector3 } from "three";

const SPEED = 3;
const direction = new THREE.Vector3(0, 0, 0);

export function FPSPlayer(props:{position?:Vector3, ref:any}) {
    const position= props.position || new Vector3(0,15,0);
    const bodyRef = useRef<RapierRigidBody>(null);
    const playerCapsuleColliderRef = useRef<RAIPER.Collider>(null);
    const [, get] = useKeyboardControls();
    const rapier = useRapier();

    useFrame((state, delta) => {
        const {forward, backward, left, right, jump, sprint} = get();
        const body = bodyRef.current;
        if (!body) return;
        // update camera position
        const bodyPos = body.translation();
        state.camera.position.set(bodyPos.x, bodyPos.y, bodyPos.z);

        // movement
        const speed = sprint ? SPEED * 3 : SPEED;
        const sideDir = Number(right) - Number(left);
        const frontDir = Number(backward) - Number(forward);
        direction
            .set(sideDir, 0, frontDir)
            .normalize()
            .multiplyScalar(speed)
            .applyEuler(state.camera.rotation);
        const velocity = body.linvel();
        body.setLinvel({x: direction.x, y: velocity.y, z: direction.z}, true);

        const maxToiColliderToGround = 1.5;
        const ray = new RAIPER.Ray(body.translation(), {x: 0, y: -1, z: 0});
        const hit = rapier.world.castRay(
            ray,
            maxToiColliderToGround,
            true,
            undefined,
            undefined,
            // filter out player capsule collider
            playerCapsuleColliderRef.current!
        );

        if (jump && hit) {
            body.applyImpulse(new THREE.Vector3(0, 9, 0), true);
        }
    });

    return (
        <>
            <PointerLockControls/>
            <RigidBody
                ref={bodyRef}
                colliders={false}
                mass={1}
                type="dynamic"
                position={position}
                enabledRotations={[false, false, false]}
            >
                <CapsuleCollider args={[0.75, 0.5]} ref={playerCapsuleColliderRef}/>
                <mesh>
                    <boxGeometry args={[1, 1.5, 1]}/>
                    <meshStandardMaterial color="blue"/>
                </mesh>
            </RigidBody>
        </>
    );
}
