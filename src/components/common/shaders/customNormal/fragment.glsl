uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
varying vec3 vNormal;

void main() {
    vec3 normalColor = normalize(vNormal) * 0.5 + 0.5;
    vec3 blendedColor = mix(uColor1, uColor2, normalColor.x);
    blendedColor = mix(blendedColor, uColor3, normalColor.y);
    gl_FragColor = vec4(blendedColor, 1.0);
}
