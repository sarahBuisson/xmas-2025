uniform sampler2D uTexture; // The texture to display
uniform float uCameraDecalage; //= 0.1 entre 0 et 1
varying vec2 vUv;           // UV coordinates passed from the vertex shader

uniform vec2 uResolution;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
uniform float ratioX;
uniform float ratioY;
void main() {
      #include <fog_fragment>
     // Sample the texture using the UV coordinates
     vec2 nuv = gl_FragCoord.xy / uResolution;
     nuv.x *= ratioX;
     nuv.y *= ratioY;

     nuv = mod(nuv, 1.0)*(1.0-uCameraDecalage) + vUv*uCameraDecalage;


    vec4 textureColor = texture2D(uTexture, nuv);

    // Set the fragment color to the sampled texture color
    gl_FragColor = textureColor;

        #ifdef USE_LOGDEPTHBUF_EXT
            float depth = gl_FragDepthEXT / gl_FragCoord.w;
        #else
            float depth = gl_FragCoord.z / gl_FragCoord.w;
        #endif
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );

}
