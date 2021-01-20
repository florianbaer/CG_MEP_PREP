/* *
*
* Define a wire frame cube with methods for drawing it .
*
* @param gl the webgl context
* @param color the color of the cube
* @returns object with draw method
* @constructor
*/
function Cube(gl, color) {
    function defineVertices(gl) {
    // define the vertices of the cube
        var vertices = [
            -.5, -.5, -.5,//0
            -.5, -.5, .5,//1
            -.5, .5, -.5,//2
            -.5, .5, .5,//3
            .5, -.5, -.5,//4
            .5, -.5, .5,//5
            .5, .5, -.5,//6
            .5, .5, .5 //7
        ]
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }

    return {
        bufferVertices: defineVertices(gl),
        color: color, draw: function (gl, aVertexPositionId, aVertexColorId) {

            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexPositionId);
            gl.drawArrays(gl.LINES,  gl.UNSIGNED_SHORT, 0);
        }
    }
}
