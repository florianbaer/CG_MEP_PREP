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
    uFragColorId: -1,
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1,
    color: -1,
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
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
    setUpAttributesAndUniforms();
    setUpBuffers();

    // set the clear color here
    // setup of colors here
    gl.clearColor(0.8,0.8,0.8,1);
    
    // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition"); // laden von Context
    ctx.uFragColorId = gl.getUniformLocation(ctx.shaderProgram, "uFragColor"); // laden von Context
}


function fillVertexBuffer() {

    rectangleObject.buffer = gl.createBuffer();

    var vertices = [
        -0.5, 0.5,
        0.5, 0.5,
        0.5, -0.5,
        -0.5, -0.5,


        -1, 1,
        -0.6, 1,
        -0.6, 0.5,
        -1, 0.5
    ]
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";

    fillVertexBuffer();
}

function drawBuffer() {

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    //set color
    gl.uniform4f(ctx.uFragColorId, 0,1,0,1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.uniform4f(ctx.uFragColorId, 0,0,1,1);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    // draw background here
    gl.clear(gl.COLOR_BUFFER_BIT);
    // add drawing routines here
    drawBuffer();
}