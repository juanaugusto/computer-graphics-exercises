
var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = 0;

var eixos;

var eixo_arbitrario;
var is_eixo_arbitrario = false;

var cBuffer, vBuffer;
var u_TipoDesenho;

var retas_paralelas_ao_cubo, cores_das_retas_paralelas;
var u_ViewMatrix;
var u_ProjMatrix;
var u_RotateMatrix;
var projMatrix;
var rotateMatrix;
var v;
var alfa;
var matrix_position;


function rotacao_do_cubo_por_eixo_arbitrario(u_Alfa, theta){
    var angle = radians(theta);

    var d = Math.sqrt(Math.pow(u_Alfa[1],2)+Math.pow(u_Alfa[2],2));
    var rx = mat4( 1.0,  0.0,  0.0, 0.0,
        0.0,  u_Alfa[2]/d,  -u_Alfa[1]/d, 0.0,
        0.0, u_Alfa[1]/d,  u_Alfa[2]/d, 0.0,
        0.0,  0.0,  0.0, 1.0 );

    var ry = mat4( d, 0.0, -u_Alfa[0], 0.0,
        0.0, 1.0,  0.0, 0.0,
        u_Alfa[0], 0.0,  d, 0.0,
        0.0, 0.0,  0.0, 1.0 );


    var rz = mat4( Math.cos(angle), -Math.sin(angle), 0.0, 0.0,
        Math.sin(angle),  Math.cos(angle), 0.0, 0.0,
        0.0,  0.0, 1.0, 0.0,
        0.0,  0.0, 0.0, 1.0 );

    return mult(mult(mult(mult(inverse(rx),inverse(ry)),rz),ry),rx);
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.482, 0.773, 0.463, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    u_TipoDesenho = gl.getUniformLocation(program, "u_TipoDesenho");
    u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");
    u_ProjMatrix = gl.getUniformLocation(program, "u_ProjMatrix");
    u_RotateMatrix = gl.getUniformLocation(program, "u_RotateMatrix");

    gl.uniformMatrix4fv(u_ViewMatrix, false, flatten(lookAt(vec3(0.20,0.25,0.25), vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0))));
    gl.uniformMatrix4fv(u_ProjMatrix, false, flatten(ortho(-2, 2, -2, 2, -2, 2 )));


    document.getElementById( "xButton" ).onclick = function () {
        mostraEixoAtual("X");
        axis = xAxis;
        is_eixo_arbitrario = false;
    };
    document.getElementById( "yButton" ).onclick = function () {
        mostraEixoAtual("Y");
        axis = yAxis;
        is_eixo_arbitrario = false;
    };
    document.getElementById( "zButton" ).onclick = function () {
        mostraEixoAtual("Z");
        axis = zAxis;
        is_eixo_arbitrario = false;
    };

    document.getElementById( "confirmaEixoArbit" ).onclick = function () {
        is_eixo_arbitrario = true;
        closeDialog();
        eixo_arbitrario = vec3(parseFloat($("#valorx").val()),parseFloat($("#valory").val()), parseFloat($("#valorz").val()));
        mostraEixoAtual(eixo_arbitrario.toString());
        alfa = normalize(eixo_arbitrario);
        matrix_position = mult(mult(rotate(Math.acos(alfa[2])*180.0/Math.PI,vec3(0,0,1)),rotate(Math.acos(alfa[1])*180.0/Math.PI,vec3(0,1,0))),rotate(Math.acos(alfa[0])*180.0/Math.PI,vec3(1,0,0)));
    };


    $('#radio-1').change(function() {
        gl.uniformMatrix4fv(u_ViewMatrix, false, flatten(lookAt(vec3(0.20,0.25,0.25), vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0))));
        gl.uniformMatrix4fv(u_ProjMatrix, false, flatten(ortho(-2, 2, -2, 2, -2, 2 )));

    });
    $('#radio-2').change(function() {
        gl.uniformMatrix4fv(u_ViewMatrix, false, flatten(lookAt(vec3(3,3,7),vec3(0,0,0), vec3(0,1,0))));
        gl.uniformMatrix4fv(u_ProjMatrix, false, flatten(perspective( 30, 1.0, 1.0, 100.0 )));

    });

    eixos = [
        vec3(0.0, 0.0, 0.0),
        vec3(0.0, 10.0, 0.0),
        vec3(0.0, 0.0, 0.0),
        vec3(10.0, 0.0, 0.0),
        vec3(0.0, 0.0, 0.0),
        vec3(0.0, 0.0, 10.0)
    ];

    cores_dos_eixos = [
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0)

    ];

    retas_paralelas_ao_cubo = [
        vec3(-0.7, -0.5, 10.0),
        vec3(-0.7, -0.5, -10.0),
        vec3(0.7, -0.5, 10.0),
        vec3(0.7, -0.5, -10.0)

    ];

    cores_das_retas_paralelas = [
        vec4(0.576, 0.161, 0.29, 1.0),
        vec4(0.576, 0.161, 0.29, 1.0),
        vec4(0.576, 0.161, 0.29, 1.0),
        vec4(0.576, 0.161, 0.29, 1.0)
    ];

    mostraEixoAtual("X");
    criaDialog();
    render();
};

function mostraEixoAtual(texto){
    $( "#eixo" ).val("Girando em torno do eixo "+texto);
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d)
{
    var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vertexColors[a]);

    }

}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta += 2.0;

    if(theta == 360.0){
        theta = 0.0;
    }

    var aux_cores_dos_eixos = cores_dos_eixos.slice(0);
    var aux_eixos = eixos.slice(0);

    if(is_eixo_arbitrario==false) {
        switch (axis) {
            case xAxis:
                rotateMatrix = rotate(theta, vec3(1, 0, 0));
                break;
            case yAxis:
                rotateMatrix = rotate(theta, vec3(0, 1, 0));
                break;
            case zAxis:
                rotateMatrix = rotate(theta, vec3(0, 0, 1));
                break;
            default:
                break;
        }
    }else{
        aux_eixos.push(vec3(0.0, 0.0, 0.0));
        aux_eixos.push(eixo_arbitrario);
        aux_cores_dos_eixos.push(vec4(0.502, 0.0, 0.0, 1.0));
        aux_cores_dos_eixos.push(vec4(0.502, 0.0, 0.0, 1.0));

        rotateMatrix = mult(rotacao_do_cubo_por_eixo_arbitrario(alfa, theta),matrix_position);
    }

    gl.uniformMatrix4fv(u_RotateMatrix, false, flatten(rotateMatrix));

    gl.uniform1i(u_TipoDesenho, 0);

    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(aux_cores_dos_eixos), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(aux_eixos), gl.STATIC_DRAW );

    for(var i = 0; i<aux_eixos.length; i=i+2){
        gl.drawArrays( gl.LINES, i, 2 );
    }

    gl.uniform1i(u_TipoDesenho, 1);

    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cores_das_retas_paralelas), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(retas_paralelas_ao_cubo), gl.STATIC_DRAW );

    for(i = 0; i<retas_paralelas_ao_cubo.length; i=i+2){
        gl.drawArrays( gl.LINES, i, 2 );
    }

    requestAnimFrame( render );
}

function criaDialog() {
    $( "#dialog" ).dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true
    });
    closeDialog();
}

function openDialog(){
    $( "#dialog" ).dialog( "open" );

}

function closeDialog() {
    $( "#dialog" ).dialog( "close" );

}

