



varying vec2 vUv;

void main() {
    // Pass UV coordinates to the fragment shader
    vUv = uv;

    // Billboard effect: Remove rotation from the modelViewMatrix
    vec4 modelViewPosition = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    modelViewPosition.xy += position.xy;

    // Final position
    gl_Position = projectionMatrix * modelViewPosition;
}
