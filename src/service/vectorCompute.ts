import { Vector3, Euler, Quaternion } from 'three';
import { quat } from '@react-three/rapier';

export function calculateLookAtRotation(positionA: Vector3, positionB: Vector3): Euler {
    // Compute the direction vector from A to B
    const direction = new Vector3().subVectors(positionB, positionA).normalize();

    // Create a default "look-at" vector (negative Z-axis in Three.js)
    const lookAtVector = new Vector3(0, 0 ,-1);

    // Compute the quaternion to rotate the object
    const quaternion = new Quaternion().setFromUnitVectors(lookAtVector, direction);

    // Convert the quaternion to Euler angles
    const euler = new Euler().setFromQuaternion(quaternion);
console.log('Calculated Euler angles:', direction, quaternion,euler);
    return euler;
}
