uniform sampler2D uTexture; // The texture to display
uniform float uCameraDecalage; //= 0.1 entre 0 et 1
varying vec2 vUv;           // UV coordinates passed from the vertex shader

uniform vec2 uResolution;


void main() {
      #include <fog_fragment>
    // Sample the texture using the UV coordinates
    vec2 nuv = gl_FragCoord.xy / uResolution;
        nuv.x *= 25.0;
        nuv.y *= 5.0;
        nuv = mod(nuv, 1.0)*(1.0-uCameraDecalage) + vUv*uCameraDecalage;


    vec4 textureColor = texture2D(uTexture, nuv);

    // Set the fragment color to the sampled texture color
    gl_FragColor = textureColor;


}
