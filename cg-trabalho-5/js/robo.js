//
// Hierarchical object using a matrix stack.
//

// A very basic stack class.
function Stack() {
    this.elements = [];
    this.t = 0;
}

Stack.prototype.push = function (m) {
    this.elements[this.t++] = m;
}

Stack.prototype.top = function () {
    if (this.t <= 0) {
        console.log("top = ", this.t);
        console.log("Warning: stack underflow");
    } else {
        return this.elements[this.t - 1];
    }
}

Stack.prototype.pop = function () {
    if (this.t <= 0) {
        console.log("Warning: stack underflow");
    }
    else {
        this.t--;
        var temp = this.elements[this.t];
        this.elements[this.t] = undefined;
        return temp;
    }
}

Stack.prototype.isEmpty = function () {
    return this.t <= 0;
}


// Creates data for vertices, colors, and normal vectors for
// a unit cube.  Return value is an object with three attributes
// vertices, colors, and normals, each referring to a Float32Array.
// (Note this is a "self-invoking" anonymous function.)
var cube = function makeCube() {
    // vertices of cube
    var rawVertices = new Float32Array([
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, -0.5]);

    var rawColors = new Float32Array([
        1.0, 0.0, 0.0, 1.0,  // red
        0.0, 1.0, 0.0, 1.0,  // green
        0.0, 0.0, 1.0, 1.0,  // blue
        1.0, 1.0, 0.0, 1.0,  // yellow
        1.0, 0.0, 1.0, 1.0,  // magenta
        0.0, 1.0, 1.0, 1.0,  // cyan
    ]);

    var rawNormals = new Float32Array([
        0, 0, 1,
        1, 0, 0,
        0, 0, -1,
        -1, 0, 0,
        0, 1, 0,
        0, -1, 0]);


    var indices = new Uint16Array([
        0, 1, 2, 0, 2, 3,  // z face
        1, 5, 6, 1, 6, 2,  // +x face
        5, 4, 7, 5, 7, 6,  // -z face
        4, 0, 3, 4, 3, 7,  // -x face
        3, 2, 6, 3, 6, 7,  // + y face
        4, 5, 1, 4, 1, 0   // -y face
    ]);

    var verticesArray = [];
    var colorsArray = [];
    var normalsArray = [];
    for (var i = 0; i < 36; ++i) {
        // for each of the 36 vertices...
        var face = Math.floor(i / 6);
        var index = indices[i];

        // (x, y, z): three numbers for each point
        for (var j = 0; j < 3; ++j) {
            verticesArray.push(rawVertices[3 * index + j]);
        }

        // (r, g, b, a): four numbers for each point
        for (var j = 0; j < 4; ++j) {
            colorsArray.push(rawColors[4 * face + j]);
        }

        // three numbers for each point
        for (var j = 0; j < 3; ++j) {
            normalsArray.push(rawNormals[3 * face + j]);
        }
    }

    return {
        numVertices: 36,
        vertices: new Float32Array(verticesArray),
        colors: new Float32Array(colorsArray),
        normals: new Float32Array(normalsArray)
    };
}();


function makeNormalMatrixElements(model, view) {
    var n = new Matrix4(view).multiply(model);
    n.transpose();
    n.invert();
    n = n.elements;
    return new Float32Array([
        n[0], n[1], n[2],
        n[4], n[5], n[6],
        n[8], n[9], n[10]]);
}


// A few global variables...

// the OpenGL context
var gl;

// handle to a buffer on the GPU
var vertexBuffer;
var vertexNormalBuffer;

// handle to the compiled shader program on the GPU
var lightingShader;

// transformation matrices defining 5 objects in the scene
var torsoMatrix = new Matrix4().setTranslate(0, 8, 0);

var leftShoulderMatrix = new Matrix4().setTranslate(-6.5, 2, 0);
var leftArmMatrix = new Matrix4().setTranslate(0, -5, 0);
var leftHandMatrix = new Matrix4().setTranslate(0, -4, 0);

var rightShoulderMatrix = new Matrix4().setTranslate(6.5, 2, 0);
var rightArmMatrix = new Matrix4().setTranslate(0, -5, 0);
var rightHandMatrix = new Matrix4().setTranslate(0, -4, 0);
var headMatrix = new Matrix4().setTranslate(0, 7, 0);
var legMatrix = new Matrix4().setTranslate(0, 2, 0);
var footMatrix = new Matrix4().setTranslate(0, -8, 0);

var torsoAngle = 0.0;

var leftShoulderAngle = 0.0;
var leftArmAngle = 0.0;
var leftHandAngle = 0.0;

var rightShoulderAngle = 0.0;
var rightArmAngle = 0.0;
var rightHandAngle = 0.0;

var headAngle = 0.0;
var legAngle = 0.0;
var footAngle = 0.0;

var torsoMatrixLocal = new Matrix4().setScale(10, 10, 5);

// var leftShoulderMatrixLocal = new Matrix4().setScale(3, 5, 2);
// var leftArmMatrixLocal = new Matrix4().setScale(3, 5, 2);
// var leftHandMatrixLocal = new Matrix4().setScale(1, 3, 3);

var shoulderMatrixLocal = new Matrix4().setScale(3, 5, 2);
var armMatrixLocal = new Matrix4().setScale(3, 5, 2);
var handMatrixLocal = new Matrix4().setScale(1, 3, 3);
var headMatrixLocal = new Matrix4().setScale(4, 4, 4);
var legMatrixLocal = new Matrix4().setScale(2, 15, 2);
var footMatrixLocal = new Matrix4().setScale(7, 2, 7);


// view matrix
var view = new Matrix4().setLookAt(
    20, 20, 20,   // eye
    0, 0, 0,      // at - looking at the origin
    0, 1, 0);     // up vector - y axis

// Here use aspect ratio 3/2 corresponding to canvas size 600 x 400
var projection = new Matrix4().setPerspective(45, 1.5, 0.1, 1000);

// translate keypress events to strings
// from http://javascript.info/tutorial/keyboard-events
function getChar(event) {
    if (event.which == null) {
        return String.fromCharCode(event.keyCode) // IE
    } else if (event.which != 0 && event.charCode != 0) {
        return String.fromCharCode(event.which)   // the rest
    } else {
        return null // special key
    }
}

// handler for key press events adjusts object rotations
function handleKeyPress(event) {
    var charCode = event.keyCode || event.which;
    var charStr = String.fromCharCode(charCode);
    var currentShoulderRot, currentArm;

    switch (charStr) {
        case 't':
            torsoAngle += 15;
            torsoMatrix.setTranslate(0, 8, 0).rotate(torsoAngle, 0, 1, 0);
            break;
        case 'T':
            torsoAngle -= 15;
            torsoMatrix.setTranslate(0, 8, 0).rotate(torsoAngle, 0, 1, 0);
            break;
        case 'j':
            leftShoulderAngle += 15;
            // rotate shoulder clockwise about a point 2 units above its center
            currentShoulderRot = new Matrix4().setTranslate(0, 2, 0).rotate(-leftShoulderAngle, 1, 0, 0).translate(0, -2, 0);
            leftShoulderMatrix.setTranslate(-6.5, 2, 0).multiply(currentShoulderRot);
            break;
        case 'J':
            leftShoulderAngle -= 15;
            currentShoulderRot = new Matrix4().setTranslate(0, 2, 0).rotate(-leftShoulderAngle, 1, 0, 0).translate(0, -2, 0);
            leftShoulderMatrix.setTranslate(-6.5, 2, 0).multiply(currentShoulderRot);
            break;
        case 'e':
            leftArmAngle += 15;
            // rotate arm clockwise about its top front corner
            currentArm = new Matrix4().setTranslate(0, 2.5, 1.0).rotate(-leftArmAngle, 1, 0, 0).translate(0, -2.5, -1.0);
            leftArmMatrix.setTranslate(0, -5, 0).multiply(currentArm);
            break;
        case 'E':
            leftArmAngle -= 15;
            currentArm = new Matrix4().setTranslate(0, 2.5, 1.0).rotate(-leftArmAngle, 1, 0, 0).translate(0, -2.5, -1.0);
            leftArmMatrix.setTranslate(0, -5, 0).multiply(currentArm);
            break;
        case 'c':
            leftHandAngle += 15;
            leftHandMatrix.setTranslate(0, -4, 0).rotate(leftHandAngle, 0, 1, 0);
            break;
        case 'C':
            leftHandAngle -= 15;
            leftHandMatrix.setTranslate(0, -4, 0).rotate(leftHandAngle, 0, 1, 0);
            break;

        case 'g':
            rightShoulderAngle += 15;
            // rotate shoulder clockwise about a point 2 units above its center
            currentShoulderRot = new Matrix4().setTranslate(0, 2, 0).rotate(-rightShoulderAngle, 1, 0, 0).translate(0, -2, 0);
            rightShoulderMatrix.setTranslate(6.5, 2, 0).multiply(currentShoulderRot);
            break;
        case 'G':
            rightShoulderAngle -= 15;
            currentShoulderRot = new Matrix4().setTranslate(0, 2, 0).rotate(-rightShoulderAngle, 1, 0, 0).translate(0, -2, 0);
            rightShoulderMatrix.setTranslate(6.5, 2, 0).multiply(currentShoulderRot);
            break;
        case 'q':
            rightArmAngle += 15;
            // rotate arm clockwise about its top front corner
            currentArm = new Matrix4().setTranslate(0, 2.5, 1.0).rotate(-rightArmAngle, 1, 0, 0).translate(0, -2.5, -1.0);
            rightArmMatrix.setTranslate(0, -5, 0).multiply(currentArm);
            break;
        case 'Q':
            rightArmAngle -= 15;
            currentArm = new Matrix4().setTranslate(0, 2.5, 1.0).rotate(-rightArmAngle, 1, 0, 0).translate(0, -2.5, -1.0);
            rightArmMatrix.setTranslate(0, -5, 0).multiply(currentArm);
            break;
        case 'z':
            rightHandAngle += 15;
            rightHandMatrix.setTranslate(0, -4, 0).rotate(rightHandAngle, 0, 1, 0);
            break;
        case 'Z':
            rightHandAngle -= 15;
            rightHandMatrix.setTranslate(0, -4, 0).rotate(rightHandAngle, 0, 1, 0);
            break;

        case 'h':
            headAngle += 15;
            headMatrix.setTranslate(0, 7, 0).rotate(headAngle, 0, 1, 0);
            break;
        case 'H':
            headAngle -= 15;
            headMatrix.setTranslate(0, 7, 0).rotate(headAngle, 0, 1, 0);
            break;
        default:
            return;
    }
}

// helper function renders the cube based on the model transformation
// on top of the stack and the given local transformation
function renderCube(matrixStack, matrixLocal) {
    // bind the shader
    gl.useProgram(lightingShader);

    // get the index for the a_Position attribute defined in the vertex shader
    var positionIndex = gl.getAttribLocation(lightingShader, 'a_Position');
    if (positionIndex < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    var normalIndex = gl.getAttribLocation(lightingShader, 'a_Normal');
    if (normalIndex < 0) {
        console.log('Failed to get the storage location of a_Normal');
        return;
    }

    // "enable" the a_position attribute 
    gl.enableVertexAttribArray(positionIndex);
    gl.enableVertexAttribArray(normalIndex);

    // bind data for points and normals
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionIndex, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.vertexAttribPointer(normalIndex, 3, gl.FLOAT, false, 0, 0);

    var loc = gl.getUniformLocation(lightingShader, "view");
    gl.uniformMatrix4fv(loc, false, view.elements);
    loc = gl.getUniformLocation(lightingShader, "projection");
    gl.uniformMatrix4fv(loc, false, projection.elements);
    loc = gl.getUniformLocation(lightingShader, "u_Color");
    gl.uniform4f(loc, 0.0, 1.0, 0.0, 1.0);
    var loc = gl.getUniformLocation(lightingShader, "lightPosition");
    gl.uniform4f(loc, 5.0, 10.0, 5.0, 1.0);

    var modelMatrixloc = gl.getUniformLocation(lightingShader, "model");
    var normalMatrixLoc = gl.getUniformLocation(lightingShader, "normalMatrix");

    // transform using current model matrix on top of stack
    var current = new Matrix4(matrixStack.top()).multiply(matrixLocal);
    gl.uniformMatrix4fv(modelMatrixloc, false, current.elements);
    gl.uniformMatrix3fv(normalMatrixLoc, false, makeNormalMatrixElements(current, view))

    gl.drawArrays(gl.TRIANGLES, 0, 36);

    // on safari 10, buffer cannot be disposed before drawing...	
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.useProgram(null);
}

// code to actually render our geometry
function draw() {
    // clear the framebuffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BIT);

    // set up the matrix stack
    var s = new Stack();

    // foot
    s.push(footMatrix);
    renderCube(s, footMatrixLocal);

    // leg relative to foot
    s.push(new Matrix4(s.top()).multiply(legMatrix));
    renderCube(s, legMatrixLocal);

    // torso relative to leg
    s.push(new Matrix4(s.top()).multiply(torsoMatrix));
    renderCube(s, torsoMatrixLocal);

    // shoulder relative to torso
    s.push(new Matrix4(s.top()).multiply(rightShoulderMatrix));
    renderCube(s, shoulderMatrixLocal);

    // arm relative to shoulder
    s.push(new Matrix4(s.top()).multiply(rightArmMatrix));
    renderCube(s, armMatrixLocal);

    // hand relative to arm
    s.push(new Matrix4(s.top()).multiply(rightHandMatrix));
    renderCube(s, handMatrixLocal);

    s.pop();
    s.pop();
    s.pop();

    // shoulder relative to torso
    s.push(new Matrix4(s.top()).multiply(leftShoulderMatrix));
    renderCube(s, shoulderMatrixLocal);

    // arm relative to shoulder
    s.push(new Matrix4(s.top()).multiply(leftArmMatrix));
    renderCube(s, armMatrixLocal);

    // hand relative to arm
    s.push(new Matrix4(s.top()).multiply(leftHandMatrix));
    renderCube(s, handMatrixLocal);

    s.pop();
    s.pop();
    s.pop();

    // head relative to torso
    s.push(new Matrix4(s.top()).multiply(headMatrix));
    renderCube(s, headMatrixLocal);

    if (!s.isEmpty()) {
        console.log("Warning: pops do not match pushes");
    }

}

// entry point when page is loaded
function main() {

    // basically this function does setup that "should" only have to be done once,
    // while draw() does things that have to be repeated each time the canvas is 
    // redrawn	

    // retrieve <canvas> element
    var canvas = document.getElementById('theCanvas');

    // key handler
    window.onkeypress = handleKeyPress;

    // get the rendering context for WebGL, using the utility from the teal book
    gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // load and compile the shader pair, using utility from the teal book
    var vshaderSource = document.getElementById('vertexLightingShader').textContent;
    var fshaderSource = document.getElementById('fragmentLightingShader').textContent;
    if (!initShaders(gl, vshaderSource, fshaderSource)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    lightingShader = gl.program;
    gl.useProgram(null);

    // buffer for vertex positions for triangles
    vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cube.vertices, gl.STATIC_DRAW);

    // buffer for vertex normals
    vertexNormalBuffer = gl.createBuffer();
    if (!vertexNormalBuffer) {
        console.log('Failed to create the buffer object');
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cube.normals, gl.STATIC_DRAW);

    // buffer is not needed anymore (not necessary, really)
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // specify a fill color for clearing the framebuffer
    gl.clearColor(0.9, 0.9, 0.9, 1.0);

    gl.enable(gl.DEPTH_TEST);

    // define an animation loop
    var animate = function () {
        draw();
        requestAnimationFrame(animate, canvas);
    };

    // start drawing!
    animate();
}
