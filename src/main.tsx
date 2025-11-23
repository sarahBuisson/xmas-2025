import { Canvas } from '@react-three/fiber'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import './styles/main.css'
import { Scene } from './components/labyrinthGame/Scene';
import { FlatMaterialDemo } from './components/common/shaders/flatMaterial/flatMaterial';

function Main() {
    return (
        <div className='main'>
            <p>Navigate with an orbital camera: click and move the mouse, zoom</p>
            <Canvas
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    toneMapping: ACESFilmicToneMapping,
                    outputColorSpace: SRGBColorSpace,
                }}
                camera={{
                    fov: 55,
                    near: 0.1,
                    far: 200,
                    position: [3, 2, 9],
                }}
                shadows
            >
                <Scene/>
            </Canvas>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <FlatMaterialDemo/>
    </React.StrictMode>
)
