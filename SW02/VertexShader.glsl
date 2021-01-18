attribute vec2 aVertexPosition;
varying vec4 vColor ;
attribute vec4 aVertexColor;


void main () {
    vColor = aVertexColor;
    gl_Position = vec4(aVertexPosition, 0, 1);
}