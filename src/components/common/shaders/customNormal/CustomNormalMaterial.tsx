import React, { useMemo } from 'react';
import { ShaderMaterial, Color } from 'three';
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'

export const CustomNormalMaterial = (props: { color1: Color, color2: Color, color3: Color }):any => {
    const material = useMemo(() => {
        return new ShaderMaterial({
            uniforms: {
                color1: { value: props.color1 },
                color2: { value: props.color2 },
                color3: { value: props.color3 },
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                varying vec3 vNormal;

                void main() {
                    vec3 normalColor = normalize(vNormal);
                    vec3 blendedColor = mix(color1, color2, abs(normalColor.z));
                    blendedColor = mix(blendedColor, color3, abs(normalColor.y));
                    gl_FragColor = vec4(blendedColor, 1.0);
                }
            `,
        });
    }, [props.color1, props.color2, props.color3]);

    return <primitive attach="material" object={material}/>;
};

