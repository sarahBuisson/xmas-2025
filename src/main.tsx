import { Canvas } from '@react-three/fiber'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/main.css'
import { KeyboardControls } from '@react-three/drei';
import { LandscapeScene } from './components/landscapeGame/LandscapeScene.tsx';

function Main() {
    return <React.StrictMode>
        <KeyboardControls
            map={[
                {name: "forward", keys: ["ArrowUp", "w", "W"]},
                {name: "backward", keys: ["ArrowDown", "s", "S"]},
                {name: "left", keys: ["ArrowLeft", "a", "A"]},
                {name: "right", keys: ["ArrowRight", "d", "D"]},
                {name: "jump", keys: ["Space"]},
            ]}>
            <Canvas shadows>
                {LandscapeScene()}
            </Canvas>

            <img id="screenshot" style={{display: 'none'}}/>
        </KeyboardControls>
    </React.StrictMode>;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    Main()
)
