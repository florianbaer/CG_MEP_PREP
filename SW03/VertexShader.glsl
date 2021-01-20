attribute vec2 aVertexPosition;
uniform mat3 uProjectionMat;
uniform mat3 uModelMat;

void main() {
    vec3 proj = uProjectionMat * uModelMat * vec3(aVertexPosition, 1);
    gl_Position = vec4(proj, 1);
}