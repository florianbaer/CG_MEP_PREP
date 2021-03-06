//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1, //wird unten wieder überschrieben
    aVertexPositionId: -1,
    aVertexColorId: -1,
    uProjMatId: -1,
    uModelMatId: -1,
};

// we keep all the parameters for drawing a specific object together
var cubes = {
    wireFrameCube: -1,
};

var canvas;

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    setUpAttributesAndUniforms();
    setUpBuffers();

    // set the clear color here
    // NOTE(TF) Aufgabe 1 / Frage:
    //     clearColor() only sets the color for the buffer, but doesn't actually do anything else.
    //     clear() has to be called in order for the color to be painted.
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    // finds the index of the variable in the program || überschreibt ctx.aVertexPositionId
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");

    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
    ctx.uProjMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjMat");
    ctx.uModelViewMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMat");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";

    cubes.wireFrameCube = WireFrameCube(gl, [1.0, 1.0, 1.0, 0.5]);

    let projMat = mat4.create();
    mat4.perspective(
        projMat,
        glMatrix.toRadian(45), // fovy
        canvas.clientWidth / canvas.clientHeight,  // aspect
        0.1, // near
        1000, // far
    );
    let uModelViewMat = mat4.create();
    mat4.lookAt(
        uModelViewMat,
        [0, -5, 0], // eye
        [0, 0, 0], // fovy / center
        [0, 0, 1], // up
    );


    // set matrices for vertex shader
    gl.uniformMatrix4fv(ctx.uProjMatId, false, projMat);
    gl.uniformMatrix4fv(ctx.uModelViewMatId, false, uModelViewMat);
}
/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");

    var worldMat = new mat4.create();


    var angle;
    var loop = function() {


        gl.uniformMatrix4fv(ctx.uModelMatId, false, worldMat);

        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        cubes.wireFrameCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId);

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    console.log("done");
}