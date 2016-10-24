var gl;

var theta = 0.0;
var thetaLoc;
var requestId;
var delay = 30;

var vColor;

var u_Translation;

var tecla_pressionada = false;

var white = true;
var red = false;
var green = false;
var blue = false;

var sentido_rot;

var sentido_rot_vargl;

var vertice_giro;

var vertices;
var lado_quadrado;

var vertices_origem;

var v_blue, v_green, v_red, v_white;

var bufferId;


$(document).ready(function () {

    $(document).keydown(function (event) {

        var charCode = event.keyCode || event.which;
        var charStr = String.fromCharCode(charCode);

        if (tecla_pressionada == false) {
            tecla_pressionada = true;

            switch (charStr.toLowerCase()) {
                case 'w'://87:
                    white = true;
                    green = false;
                    blue = false;
                    red = false;

                    break;
                case 'b':
                    blue = true;
                    green = false;
                    white = false;
                    red = false;

                    break;
                case 'r':
                    red = true;
                    green = false;
                    blue = false;
                    white = false;
                    break;
                case 'g':
                    green = true;
                    white = false;
                    blue = false;
                    red = false;
                    break;
                default:
                    tecla_pressionada = false;
                    break;
            }

        }

    });


    var canvas = document.getElementById("gl-canvas");

    var projMatrix = ortho(-2.0, 2.0, -2.0, 2.0, -1.0, 1.0);

    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    //gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.clearColor(0.4, 0.4, 0.75, 0.6);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    lado_quadrado = 2.0;


    v_white = vec2(lado_quadrado / 2.0, lado_quadrado / 2.0);
    v_red = vec2(lado_quadrado / 2.0, -lado_quadrado / 2.0);

    v_green = vec2(-lado_quadrado / 2.0, lado_quadrado / 2.0);

    v_blue = vec2(-lado_quadrado / 2.0, -lado_quadrado / 2.0);

    vertices = [
        v_white,
        v_red,
        v_green,
        v_blue];

    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var colors = [
        vec4(1.0, 1.0, 1.0, 1.0),    // branco
        vec4(1.0, 0.0, 0.0, 1.0),    // vermelho
        vec4(0.0, 1.0, 0.0, 1.0),    // verde
        vec4(0.0, 0.0, 1.0, 1.0)    // azul
    ];

    var squareVerticesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vertexColorAttribute = gl.getAttribLocation(program, "aVertexColor");
    gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexColorAttribute);

    u_Translation = gl.getUniformLocation(program, "u_Translation");
    sentido_rot_vargl = gl.getUniformLocation(program, "sentido_rot");

    vColor = gl.getUniformLocation(program, "vColor");
    thetaLoc = gl.getUniformLocation(program, "theta");
    u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');

    vertice_giro = vec2(lado_quadrado / 2.0, lado_quadrado / 2.0);
    sentido_rot = 1.0;

    gl.uniformMatrix4fv(u_ProjMatrix, false, flatten(projMatrix));

    render();

});

function gira_em_torno_vertice(v_giro, point, angulo) {
    var factor = Math.PI / 180.0;

    var s = 1.0 * Math.sin(angulo * factor);
    var c = Math.cos(angulo * factor);

    var traz_pra_origem = subtract(point, v_giro);

    var gira = vec2(c * traz_pra_origem[0] - s * traz_pra_origem[1], c * traz_pra_origem[1] + s * traz_pra_origem[0]);

    return add(gira, v_giro);

}

function render() {

    gl.clear(gl.COLOR_BUFFER_BIT);

    theta += 5;

    vertices = [
        gira_em_torno_vertice(vertice_giro, v_white, theta),
        gira_em_torno_vertice(vertice_giro, v_red, theta),
        gira_em_torno_vertice(vertice_giro, v_green, theta),
        gira_em_torno_vertice(vertice_giro, v_blue, theta)
    ];


    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    setTimeout(
        function () {

            if (tecla_pressionada) {
                theta = 0.0;
                tecla_pressionada = false;
                cancelAnimationFrame(requestId);

                if (white) {
                    vertice_giro = vertices[0];
                } else if (green) {
                    vertice_giro = vertices[2];
                } else if (blue) {
                    vertice_giro = vertices[3];
                } else if (red) {
                    vertice_giro = vertices[1];
                }

                v_white = vertices[0];
                v_green = vertices[2];
                v_blue = vertices[3];
                v_red = vertices[1];

                requestId = requestAnimFrame(render);

            } else {
                if (theta == 360) {
                    theta = 0.0;
                }
                requestId = requestAnimFrame(render);

            }

        }, delay
    );


}


