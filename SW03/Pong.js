//
// DI Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uProjectionMatId: -1,
    uModelMatId: -1,
    lastTime: -1,
    speed: 0.5,
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1
};


function movePaddle(deltaTime) {
    if (isDown(key.DOWN) && gameObj.playerPaddle.position[1] > -300 + (gameObj.playerPaddle.scale[1] / 2)) {
        gameObj.playerPaddle.position[1] = gameObj.playerPaddle.position[1] - deltaTime * ctx.speed;
    }
    if (isDown(key.UP) && gameObj.playerPaddle.position[1] < +300 - (gameObj.playerPaddle.scale[1] / 2)) {
        gameObj.playerPaddle.position[1] = gameObj.playerPaddle.position[1] + deltaTime * ctx.speed;
    }
}

function setAiPaddle() {
    gameObj.aiPaddle.position[1] = gameObj.ball.position[1];
}

function checkPaddleHit() {
    let upperPaddle = gameObj.playerPaddle.position[1]+gameObj.playerPaddle.scale[1]/2;
    let lowerPaddle = gameObj.playerPaddle.position[1]-gameObj.playerPaddle.scale[1]/2;
    return gameObj.ball.position[0] > 330 &&
        gameObj.ball.position[0] < 340 &&
        upperPaddle > gameObj.ball.position[1] &&
        lowerPaddle < gameObj.ball.position[1]
}

function reset() {
    gameObj.ball.position = [100, 80]
}

function moveBall(deltaTime) {
    if(gameObj.ball.position[0] < -335){
        gameObj.ball.movement[0] *= -1;
    }
    if(Math.abs(gameObj.ball.position[1]) > 290){
        gameObj.ball.movement[1] *= -1;
    }
    if(checkPaddleHit()){
        gameObj.ball.movement[0] *= -1;
    }

    if(gameObj.ball.position[0] > 340){
        reset();
    }

    gameObj.ball.position[0] = gameObj.ball.position[0] + gameObj.ball.movement[0]*deltaTime;
    gameObj.ball.position[1] = gameObj.ball.position[1] + gameObj.ball.movement[1]*deltaTime;
}

function game(deltaTime){
    movePaddle(deltaTime);
    setAiPaddle();
    moveBall(deltaTime);
}


function drawAnimated() {
    let currTime = (new Date());
    let deltaTime = currTime-ctx.lastTime;
    ctx.lastTime = currTime;

    this.game(deltaTime);

    // move or change objects
    draw();
    // request the next frame
    window.requestAnimationFrame(drawAnimated) ;
}

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    ctx.lastTime = (new Date());
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);
    draw();
    window.requestAnimationFrame(drawAnimated);

}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();

    setUpBuffers();
    let projectionMatrix = mat3.create();
    mat3.fromScaling(projectionMatrix, [2.0/gl.drawingBufferWidth, 2.0/gl.drawingBufferHeight]);
    gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMatrix);
    
    gl.clearColor(0.1, 0.1, 0.1, 1);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    var vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5];
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}
let gameObj = {
    ball: {
        scale: [20, 20],
        position: [100, 80],
        movement: [-0.10, -0.10]
    },
    playerPaddle: {
        scale: [15, 100],
        position: [350, 0]
    },
    aiPaddle: {
        scale: [15, 50],
        position: [-350, 80]
    },
    middleLine: {
        scale: [3, 600],
        position: [0, 0]
    }
}
// Key Handling
var key = {
    _pressed : {} ,
    LEFT : 37 ,
    UP : 38 ,
    RIGHT : 39 ,
    DOWN : 40
};

function isDown ( keyCode ) {
    return key . _pressed [ keyCode ];
}
function onKeydown ( event ) {
    key . _pressed [ event . keyCode ] = true ;
}
function onKeyup ( event ) {
    delete key . _pressed [ event . keyCode ];
}



/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    //console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);

    for (let e in gameObj){

        let modelMat = mat3.create();
        mat3.translate(modelMat ,modelMat, gameObj[e].position);
        mat3.scale(modelMat, modelMat, gameObj[e].scale);
        gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
}

// Key Handling
var key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

function isDown (keyCode) {
    return key._pressed[keyCode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
}
