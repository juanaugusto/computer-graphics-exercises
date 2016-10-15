var gl;

var theta = 0.0;
var thetaLoc;
var requestId;
var delay = 100;

var vColor;
const black = vec4(0.0, 0.0, 0.0, 1.0);
const red = vec4(1.0, 0.0, 0.0, 1.0);

var Tx = 0.7, Ty = 0.0, Tz = 0.0;
var u_Translation;
var translacao_1, translacao_2;
var matriz, resultado;
var squareVerticesColorBuffer;

var tecla_pressionada = false;

var sup_dir = true;
var inf_dir = false;
var sup_esq = false;
var inf_esq = false;

var sentido_rot;

var sentido_rot_vargl;

var vertice_giro;

var vertices;

//var bufferId, squareVerticesColorBuffer;

//var vertexColorAttribute;

$(document).ready(function () {

    $(document).keydown( function(event) {

        if(tecla_pressionada==false){
            tecla_pressionada = true;

            if(sup_dir==true){
                sup_dir = false;
                sup_esq = true;
            }else if(sup_esq==true){
                sup_esq = false;
                inf_esq = true;

            }else if(inf_esq==true){
                inf_esq = false;
                inf_dir = true;
            }else if(inf_dir==true){
                inf_dir = false;
                sup_dir = true;
            }
        }


    });



    var canvas = document.getElementById("gl-canvas");


    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    //gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.clearColor(0.4, 0.4, 0.75, 0.6);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    vertices = [
        vec2(0.7, 0.7),
        vec2(0.7, -0.7),

        vec2(-0.7, 0.7),
        vec2(-0.7, -0.7)

    ];


    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    var colors = [
        vec4(1.0,  1.0,  1.0,  1.0),    // white
        vec4(1.0,  0.0,  0.0,  1.0),    // red
        vec4(0.0,  1.0,  0.0,  1.0),    // green
        vec4(0.0,  0.0,  1.0,  1.0)    // blue
    ];

    var squareVerticesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);


    var vertexColorAttribute = gl.getAttribLocation(program, "aVertexColor");
    gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexColorAttribute);



    u_Translation = gl.getUniformLocation(program, "u_Translation");
    sentido_rot_vargl = gl.getUniformLocation(program, "sentido_rot");

    //translacao_1 = gl.getUniformLocation(program, "translacao_1");
    //translacao_2 = gl.getUniformLocation(program, "translacao_2");

    vColor = gl.getUniformLocation(program, "vColor");
    thetaLoc = gl.getUniformLocation(program, "theta");
    //matriz = gl.getUniformLocation(program, "matriz");

    vertice_giro = vec4(0.7,0.7,0.0,0.0);
    sentido_rot = 1.0;



    //gl.uniform4f(vColor, flatten(red));
    //squareVerticesColorBuffer = gl.createBuffer();
    //gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    render();




});


function render() {
    //gl.clear( gl.COLOR_BUFFER_BIT |  gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    theta += 5;
    //if(theta>2*Math.PI){
        //theta = 0.0;
    //}
    gl.uniform1f(thetaLoc, theta);
    gl.uniform1f(sentido_rot_vargl, sentido_rot);
    gl.uniform4fv(u_Translation, vertice_giro);


    //gl.uniform4f(translacao_1, 0.5, 0.0, 0.0, 0.0); //x=1 y=0 rotacionar sobre esse ponto

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    setTimeout(
        function () {

            if(theta==360 && tecla_pressionada){
                theta = 0.0;
                tecla_pressionada = false;
                cancelAnimationFrame(requestId);

                if(sup_dir){
                    vertice_giro = vec4(0.7,0.7,0.0,0.0);
                    sentido_rot = 1.0;
                } else if(sup_esq){
                    vertice_giro = vec4(-0.7,0.7,0.0,0.0);
                    sentido_rot = -1.0;
                } else if(inf_esq){
                    vertice_giro = vec4(-0.7,-0.7,0.0,0.0);
                    sentido_rot = 1.0;
                } else if(inf_dir){
                    vertice_giro = vec4(0.7,-0.7,0.0,0.0);
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


