import { useFrame, useThree } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { Mesh, Quaternion, Raycaster, TextureLoader, Vector3 } from "three";
import { clamp, lerp } from "three/src/math/MathUtils";
import { useRef } from 'react';
import { useKeyboard } from '../../labyrinthGame/useKeyboard.ts';
import { useMouseCapture } from '../../labyrinthGame/useMouseCapture.ts';


function getInput(keyboard: any, mouse: { x: number, y: number }) {
  let [x, y, z] = [0, 0, 0];
  // Checking keyboard inputs to determine movement direction
  if (keyboard.get("s")) z += 1.0; // Move backward
  if (keyboard.get("z")) z -= 1.0; // Move forward
  if (keyboard.get("d")) x += 1.0; // Move right
  if (keyboard.get("q")) x -= 1.0; // Move left
  if (keyboard.get(" ")) y += 1.0; // Jump

  // Returning an object with the movement and look direction

  return {
    move: [x, y, z],
    look: [mouse.x / window.innerWidth, mouse.y / window.innerHeight], // Mouse look direction
    running: keyboard.get("Shift"), // Boolean to determine if the player is running (Shift key pressed)
  };
}
export const FPSPlayer = ({
                         walk = 3,
                         jump = 4,
                         positionInitial = new Vector3(0, 20, 0),
    children= null
                       }) => {
  const api = useRef<RapierRigidBody>(null); // Reference to the RigidBody API provided by "@react-three/rapier".
  const meshR = useRef<Mesh>(null); // Reference to the 3D mesh of the player character.
  const {scene, camera} = useThree(); // Get the 3D scene and camera provided by "@react-three/fiber".
  const keyboard = useKeyboard(); // Hook to get keyboard input
  const mouse = useMouseCapture(); // Hook to get mouse input


  function getInput(keyboard: any, mouse: { x: number, y: number }) {
    let [x, y, z] = [0, 0, 0];
    // Checking keyboard inputs to determine movement direction
    if (keyboard.get("s")) z += 1.0; // Move backward
    if (keyboard.get("z")) z -= 1.0; // Move forward
    if (keyboard.get("d")) x += 1.0; // Move right
    if (keyboard.get("q")) x -= 1.0; // Move left
    if (keyboard.get(" ")) y += 1.0; // Jump

    // Returning an object with the movement and look direction

    return {
      move: [x, y, z],
      look: [mouse.x / window.innerWidth, mouse.y / window.innerHeight], // Mouse look direction
      running: keyboard.get("Shift"), // Boolean to determine if the player is running (Shift key pressed)
    };
  }

  let phi = 0; // Horizontal angle of the camera's orientation.
  let theta = 0; // Vertical angle of the camera's orientation.

  // Declare reusable, non-persistent variables (avoiding recreation every frame).
  const speed = new Vector3(walk / 2, jump, walk); // Vector representing the player's movement speed.
  const offset = new Vector3(0, 0, 0); // Vector used to calculate the player's movement based on user input.
  const gaze = new Quaternion(); // Quaternion representing the direction the player character is looking at.
  const yaw = new Quaternion(); // Quaternion controlling horizontal rotations of the player's camera.
  const pitch = new Quaternion(); // Quaternion controlling vertical rotations of the player's camera.
  const cameraOffset = new Vector3(0, 0, 0); // Vector representing the offset of the camera from the player's position.
  const down = new Vector3(0, -1, 0); // Vector pointing downwards, used for raycasting to determine ground collision.
  const yAxis = new Vector3(0, 1, 0); // Vector representing the world's y-axis.
  const xAxis = new Vector3(1, 0, 0); // Vector representing the world's x-axis.
  const raycaster = new Raycaster(new Vector3(0, 0, 0), down, 0, 2); // Raycaster for ground collision detection.
  const slope = new Vector3(0, 1, 0); // Vector representing the slope of the ground surface.

  // Function to update the player's camera orientation based on user input.
  const updateOrientation = ([x, y]: number[]) => {
    const cameraSpeed = 3; // Speed factor for camera movement.
    const step = 0.3; // Step for smooth interpolation of camera orientation changes.
    phi = lerp(phi, -x * cameraSpeed, step); // Interpolate horizontal camera rotation.
    theta = lerp(theta, -y * cameraSpeed, step); // Interpolate vertical camera rotation.
    theta = clamp(theta, -Math.PI / 3, Math.PI / 3); // Clamp vertical rotation within limits.

    yaw.setFromAxisAngle(yAxis, phi); // Set the yaw quaternion based on horizontal rotation.
    pitch.setFromAxisAngle(xAxis, theta); // Set the pitch quaternion based on vertical rotation.
    gaze.multiplyQuaternions(yaw, pitch).normalize(); // Combine yaw and pitch to get the gaze direction.
  };

  useFrame(() => {
    if (!api.current || !meshR.current) return;
    const position = api.current.translation() as Vector3; // Get the player's current position from the RigidBody API.
    const {move, look, running} = getInput(keyboard,mouse); // Get current player input, including movement and camera look direction.

    updateOrientation(look); // Update the player's camera orientation based on the camera look direction.

    // Filter the scene's children to get all walkable objects (excluding the player's mesh).
    const walkable = scene.children.filter(
        (o) => o.children[0]?.uuid !== meshR?.current?.uuid
    );

    raycaster.set(position, down);
    // Calculate the offset vector for player movement based on user input, speed, and orientation.
    offset
        .fromArray(move)
        .normalize()
        .multiply(running ? speed.clone().multiplyScalar(2.5) : speed)
        .applyQuaternion(yaw);

    api.current.applyImpulse(offset, true);

    const newPosition = new THREE.Vector3(position.x, position.y, position.z);
    camera.position.lerp(
        newPosition.add(cameraOffset.clone().applyQuaternion(yaw)),
        0.25
    );

    camera.quaternion.copy(gaze);
  });

  let textureStar = new TextureLoader().load("./assets/star.png");

  return (
      <RigidBody
          ref={api}
          lockRotations
          position={positionInitial}
          friction={0.5}
          restitution={0.5}
          colliders="ball"
      >
        <mesh ref={meshR} userData={{tag: "player"}} castShadow>
          {children||( <sphereGeometry args={[0.5, 16, 16]}></sphereGeometry>)}

        </mesh>
      </RigidBody>
  );  /*   />*/
};
