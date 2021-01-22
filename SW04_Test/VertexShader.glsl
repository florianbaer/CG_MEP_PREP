attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
varying vec4 vVertexColor;

uniform mat4 uProjectionMat;
uniform mat4 uViewMat;
uniform mat4 uModelMat;


void main () {
    vVertexColor = aVertexColor;
    vec4 position = uProjectionMat * uViewMat * uModelMat * vec4(aVertexPosition, 1);
    gl_Position = position;
}