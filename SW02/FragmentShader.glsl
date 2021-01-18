precision mediump float;
uniform vec4 uFragColor;
varying vec4 vColor ;
varying vec2 vVertexTextureCoord;
uniform sampler2D uSampler;

void main() {
    //gl_FragColor = vColor;
    gl_FragColor = texture2D(uSampler, vVertexTextureCoord);
}