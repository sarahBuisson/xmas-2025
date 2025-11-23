uniform sampler2D uTexture; // The texture to display
varying vec2 vUv;           // UV coordinates passed from the vertex shader

uniform vec2 uResolution;
void main() {
    // Sample the texture using the UV coordinates


    vec4 textureColor = texture2D(uTexture, vUv);

    // Set the fragment color to the sampled texture color
    gl_FragColor = textureColor;
}
