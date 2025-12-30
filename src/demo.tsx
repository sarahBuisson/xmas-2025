import { Canvas, extend } from '@react-three/fiber'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/main.css'
import { KeyboardControls, OrbitControls } from '@react-three/drei';
import { Bouncy } from './components/common/Bouncy.tsx';
import { IsInteractible } from './components/common/interactiveRender/IsInteractible.tsx';
import FakeGlowMaterial from './components/common/material/FakeGlowMaterial.tsx';
import Fireworks from './components/common/Fireworks.tsx';
import { ProgressiveAppear } from './components/common/interactiveRender/ProgressiveAppear.tsx';
import { MoveOnClickWrapper } from './components/common/interactiveRender/MoveOnClick.tsx';
import { Vector3 } from 'three';
import { Physics, RigidBody } from '@react-three/rapier';
import { Home } from './components/christmasGame/decor/Home.tsx';
import { StartZone } from './components/christmasGame/decor/StartZone.tsx';
import { Wind } from './components/christmasGame/decor/Wind.tsx';
import { Ornement, TreeBall } from './components/christmasGame/decor/trees.tsx';

extend({Bouncy})

function MainDemo() {


    return <React.StrictMode>
        <KeyboardControls
            map={[
                {name: "forward", keys: ["ArrowUp", "w", "W"]},
                {name: "backward", keys: ["ArrowDown", "s", "S"]},
                {name: "left", keys: ["ArrowLeft", "a", "A"]},
                {name: "right", keys: ["ArrowRight", "d", "D"]},
                {name: "jump", keys: ["Space"]},
            ]}>
            <Canvas shadows={true}>
                <OrbitControls></OrbitControls>

                <pointLight position={[2, 2, 4]} intensity={1}  distance={20} castShadow></pointLight>
                <ambientLight></ambientLight>
                <Ornement></Ornement>

            </Canvas>

            <img id="screenshot" style={{display: 'none'}}/>
        </KeyboardControls>
    </React.StrictMode>
        ;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    MainDemo()
)
