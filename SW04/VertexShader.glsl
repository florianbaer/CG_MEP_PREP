attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
varying vec4 vVertexColor;

uniform mat4 uProjMat;
uniform mat4 uViewMat;
uniform mat4 uModelMat;


void main () {
    vVertexColor = aVertexColor;

    vec4 position = uProjMat * uViewMat * uModelMat * vec4(aVertexPosition, 1);
    gl_Position = position;
}