var gl;

var theta = 0.0;
var thetaLoc;
var requestId;
var delay = 30;

var vColor;

var u_Translation;

var tecla_pressionada = false;

var sup_dir = true;
var inf_dir = false;
var sup_esq = false;
var inf_esq = false;

var sentido_rot;

var sentido_rot_vargl;

var vertice_giro;

var vertices;
var lado_quadrado;

$(document).ready(function () {

    $(document).keydown( function(event) {

        var charCode = event.keyCode || event.which;
        var charStr = String.fromCharCode(charCode);

        if(tecla_pressionada==false){
            tecla_pressionada = true;

            switch (charStr.toLowerCase()){
                case 'w'://87:
                    sup_dir = true;
                    sup_esq = false;
                    inf_esq = false;
                    inf_dir = false;

                    break;
                case 'b':
                    inf_esq = true;
                    sup_esq = false;
                    sup_dir = false;
                    inf_dir = false;

                    break;
                case 'r':
                    inf_dir = true;
                    sup_esq = false;
                    inf_esq = false;
                    sup_dir = false;
                    break;
                case 'g':
                    sup_esq = true;
                    sup_dir = false;
                    inf_esq = false;
                    inf_dir = false;
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
    vertices = [
        vec2(lado_quadrado/2.0, lado_quadrado/2.0),
        vec2(lado_quadrado/2.0, -lado_quadrado/2.0),
        vec2(-lado_quadrado/2.0, lado_quadrado/2.0),
        vec2(-lado_quadrado/2.0, -lado_quadrado/2.0)
    ];

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var colors = [
        vec4(1.0,  1.0,  1.0,  1.0),    // branco
        vec4(1.0,  0.0,  0.0,  1.0),    // vermelho
        vec4(0.0,  1.0,  0.0,  1.0),    // verde
        vec4(0.0,  0.0,  1.0,  1.0)    // azul
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
    u_ProjMatrix = gl.getUniformLocation(program,'u_ProjMatrix');

    vertice_giro = vec4(lado_quadrado/2.0, lado_quadrado/2.0, 0.0, 0.0);
    sentido_rot = 1.0;

    gl.uniformMatrix4fv(u_ProjMatrix, false, flatten(projMatrix));


    render();

});


function render() {

    gl.clear(gl.COLOR_BUFFER_BIT);

    theta += 5;

    gl.uniform1f(thetaLoc, theta);
    gl.uniform1f(sentido_rot_vargl, sentido_rot);
    gl.uniform4fv(u_Translation, vertice_giro);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    setTimeout(
        function () {

            if(theta==360 && tecla_pressionada){
                theta = 0.0;
                tecla_pressionada = false;
                cancelAnimationFrame(requestId);

                if(sup_dir){
                    vertice_giro = vec4(lado_quadrado/2.0,lado_quadrado/2.0,0.0,0.0);
                    sentido_rot = 1.0;
                } else if(sup_esq){
                    vertice_giro = vec4(-lado_quadrado/2.0,lado_quadrado/2.0,0.0,0.0);
                    sentido_rot = -1.0;
                } else if(inf_esq){
                    vertice_giro = vec4(-lado_quadrado/2.0,-lado_quadrado/2.0,0.0,0.0);
                    sentido_rot = 1.0;
                } else if(inf_dir){
                    vertice_giro = vec4(lado_quadrado/2.0,-lado_quadrado/2.0,0.0,0.0);
                    sentido_rot = -1.0;
                }

                requestId = requestAnimFrame(render);

            }else{
                if(theta==360){
                    theta = 0.0;
                }
                requestId = requestAnimFrame(render);

            }

        }, delay
    );


}


