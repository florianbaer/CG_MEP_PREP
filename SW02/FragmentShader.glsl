precision mediump float;
uniform vec4 uFragColor;
varying vec4 vColor ;

void main() {
    //uFragColor = vColor;
    gl_FragColor = vColor;
}