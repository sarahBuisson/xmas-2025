import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(),        glsl() ],
    base: '/three-js-aquarium-challenge/',
    assetsInclude: [
        '**/*.stl',   // STereoLithography
        '**/*.mp3',   // STereoLithography
        '**/*.svg',   // STereoLithography
        '**/*.glb',   // GL Binary (GLTF)
        '**/*.gltf',  // GL Transmission Format
        '**/*.fbx',   // Filmbox
        '**/*.obj',   // Wavefront OBJ
        '**/*.dae',   // COLLADA
        '**/*.ply',   // Polygon File Format
        '**/*.png',   // Polygon File Format
    ],
})
