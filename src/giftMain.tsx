import { Canvas } from '@react-three/fiber'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/main.css'
import { KeyboardControls, OrbitControls } from '@react-three/drei';
import { AnimateSpiralGeometry } from './components/christmasGame/decor/decors.tsx';
import { Snow } from './components/christmasGame/Snow.tsx';
import { GiftScene } from './components/christmasGame/gift/GiftScene.tsx';

function GiftDemo() {


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
             <GiftScene></GiftScene>
            </Canvas>

            <img id="screenshot" style={{display: 'none'}}/>
        </KeyboardControls>
    </React.StrictMode>;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    GiftDemo()
)
