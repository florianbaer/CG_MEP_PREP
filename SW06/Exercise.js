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
    aNormalVertexId:-1,

    uProjectionMatId: -1,
    uNormalMatrixId: -1,

    uEnableLightingId: -1,
    uEnableTextureId:-1,
    aVertexTextureCoordId: -1,

    uLightPositionId: -1,
    uLightColorId: -1,
    uModelMatrixId: -1,
};

// we keep all the parameters for drawing a specific object together
var cubes = {
    wireFrameCube: -1,
    solidCube: -1,
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
    loadTexture();
    draw();
}

var lennaTex = {
    texture: {},
};
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

function loadTexture() {
    var image = new Image();
    lennaTex.texture = gl.createTexture();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, lennaTex.texture);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        draw();
    };
    image.src = "lena512.png";
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms() {
    "use strict";
    // finds the index of the variable in the program || überschreibt ctx.aVertexPositionId
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aNormalVertexId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");
    ctx.aVertexTextureCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");

    ctx.uProjectionMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    ctx.uModelViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");
    ctx.uModelMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uModelMatrix");
    ctx.uNormalMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMatrix");
    ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");
    ctx.uLightPositionId = gl.getUniformLocation(ctx.shaderProgram, "uLightPosition");
    ctx.uEnableLightingId = gl.getUniformLocation(ctx.shaderProgram, "uEnableLighting");
    ctx.uEnableTextureId = gl.getUniformLocation(ctx.shaderProgram, "uEnableTexture");
    ctx.uSamplerId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
    "use strict";

    //cubes.wireFrameCube = Cube(gl, [1.0, 1.0, 1.0, 0.5]);
    cubes.solidCube = SolidCube(gl, [1,0,0], [1,0.2,0.2],[0.5,0.5,1],[0,0.5,0],[1,1,0.5],[255,0,0]);
    cubes.sphere = SolidSphere(gl, 200,100, [255,0,0,255])
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");

    let projMat = mat4.create();
    mat4.perspective(
        projMat,
        glMatrix.toRadian(45), // fovy
        canvas.clientWidth / canvas.clientHeight,  // aspect
        0.1, // near
        1000, // far
    );
    let viewMatrix = mat4.create();
    mat4.lookAt(
        viewMatrix,
        [5, 5, 2], // eye
        [0, 0, -1], // fovy / center
        [0, 0, 1], // up
    );
    let angle;

    let normalMatrix = mat3.create();

    mat3.normalFromMat4(normalMatrix, viewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);

    gl.uniform1i(ctx.uEnableLightingId, true);
    gl.uniform1i(ctx.uEnableTextureId, true);
    gl.uniform1i(ctx.uSamplerId, 0);

    var loop = function () {
        mat3.normalFromMat4(normalMatrix, viewMatrix);
        gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);

        gl.uniform3fv(ctx.uLightPositionId, [0, 0, 0]);
        gl.uniform3fv(ctx.uLightColorId, [0, 0, 1]);

        gl.uniform1i(ctx.uEnableLightingId, true);
        gl.uniform1i(ctx.uEnableTextureId, true);
        gl.uniform1i(ctx.uSamplerId, 0);

        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        gl.clearColor(0.8, 0.8, 0.8, 1);

        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT); // reset


        gl.uniform3fv(ctx.uLightPositionId, [0, 0, 0]);

        // set matrices for vertex shader
        gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, viewMatrix);
        gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, projMat);



        gl.bindTexture(gl.TEXTURE_2D, lennaTex.texture);
        gl.activeTexture(gl.TEXTURE0);

        // draw sphere
        let modelMatrix = mat4.create()
        let viewMatrixWorld = mat4.create()
        mat4.translate(modelMatrix,modelMatrix, [3, 0, 0]);
        mat4.rotate(modelMatrix,modelMatrix, angle, [0,0,1]);
        gl.uniformMatrix4fv(ctx.uModelMatrixId, false, modelMatrix);

        mat4.multiply(viewMatrixWorld, viewMatrix, modelMatrix);
        mat3.normalFromMat4(normalMatrix, viewMatrixWorld);
        gl.uniformMatrix3fv(ctx.uNormalMatrixId,false,normalMatrix);
        cubes.solidCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexTextureCoordId, ctx.aNormalVertexId);
        //cubes.sphere.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aNormalVertexId);


        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    console.log("done");
}