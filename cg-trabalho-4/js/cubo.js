
$(document).ready(function () {

    var canvas = document.getElementById("gl-canvas");

    var proj_matrix = ortho(-3.0, 3.0, -3.0, 3.0, -3.0, 3.0);

    var gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.4, 0.4, 0.75, 0.6);

    gl.clear(gl.COLOR_BUFFER_BIT);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var eixos = [
        vec3(0.0, 0.0, 0.0),
        vec3(3.0, 0.0, 0.0), // eixo X
        vec3(0.0, 0.0, 0.0),
        vec3(0.0, 3.0, 0.0), // eixo Y
        vec3(0.0, 0.0, 0.0),
        vec3(0.0, 0.0, 3.0) // eixo Z

    ];

    var buffer_eixos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_eixos);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(eixos), gl.STATIC_DRAW);

    // Associate shader vertex variable with data buffer
    var a_vertice_eixo = gl.getAttribLocation(program, "a_vertice_eixo");
    gl.vertexAttribPointer(a_vertice_eixo, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_vertice_eixo);


    var u_proj_matrix = gl.getUniformLocation(program, "u_proj_matrix");
    gl.uniformMatrix4fv(u_proj_matrix, false, flatten(proj_matrix));

    var i;
    for(i = 0; i<eixos.length; i=i+2){
        gl.drawArrays(gl.LINES, i, 2);
    }


});





