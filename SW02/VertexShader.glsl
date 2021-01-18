attribute vec2 aVertexPosition;
varying vec4 vColor ;
attribute vec4 aVertexColor;
attribute vec2 aVertexTextureCoord;
varying vec2 vVertexTextureCoord;

void main () {
    vColor = aVertexColor;
    vVertexTextureCoord = aVertexTextureCoord;
    gl_Position = vec4(aVertexPosition, 0, 1);
}