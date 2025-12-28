import React, { useMemo } from 'react';
import { Color, ShaderChunk, ShaderMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

export const CustomNormalMaterial = (props: { color1: Color, color2: Color, color3: Color }): any => {
    const material = useMemo(() => {

        return new ShaderMaterial({
            uniforms: {
                color1: {value: props.color1},
                color2: {value: props.color2},
                color3: {value: props.color3},
                uTime: {type: "f", value: 0},

                offset: {type: "f", value: 33},
                exponent: {type: "f", value: 0.6},
                fogColor: {type: "c", value: new Color("red")},
                fogNear: {type: "f", value: 0.2},
                fogFar: {type: "f", value: 1},
                fogDensity: {type: "f", value: 0.5},
                vFogDepth : {type: "f", value: 0.5}
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec4 mvPosition;
                 ${ShaderChunk[ "common" ]}
                 ${ShaderChunk["fog_pars_vertex"]}
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    ${ShaderChunk["fog_vertex"]}
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                uniform float uTime;
                varying vec3 vNormal;
                ${ShaderChunk["common"]}
                ${ShaderChunk["fog_pars_fragment"]}
                void main() {
                    vec3 normalColor = normalize(vNormal);
                     float t = uTime*0.3;

    // Rotation matrices for x, y, and z axes
    mat3 rotationX = mat3(
        1.0, 0.0, 0.0,
        0.0, cos(t), -sin(t),
        0.0, sin(t), cos(t)
    );

    mat3 rotationY = mat3(
        cos(t), 0.0, sin(t),
        0.0, 1.0, 0.0,
        -sin(t), 0.0, cos(t)
    );

    mat3 rotationZ = mat3(
        cos(t), -sin(t), 0.0,
        sin(t), cos(t), 0.0,
        0.0, 0.0, 1.0
    );

    // Apply rotations around all axes
    normalColor = rotationZ * rotationY * rotationX * normalColor;

                    vec3 blendedColor = mix(color1, color2, abs(normalColor.z));
                    blendedColor = mix(blendedColor, color3, abs(normalColor.y));
                  gl_FragColor = vec4(blendedColor, 1.0);
                      ${ShaderChunk["fog_fragment"]}
                }
            `,
            fog: true
        });
    }, [props.color1, props.color2, props.color3]);


    useFrame(({ clock }) => {
        material.uniforms.uTime.value = clock.elapsedTime;
    });
    return <primitive attach="material" object={material}/>;
};

