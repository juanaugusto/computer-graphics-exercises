
var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var eixos;

var thetaLoc;

var cBuffer, vBuffer;
var u_TipoDesenho;

var retas_paralelas_ao_cubo, cores_das_retas_paralelas;
var u_ViewMatrix;
var u_ProjMatrix;
var projMatrix;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

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

    thetaLoc = gl.getUniformLocation(program, "theta");
    u_TipoDesenho = gl.getUniformLocation(program, "u_TipoDesenho");
    u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");
    u_ProjMatrix = gl.getUniformLocation(program, "u_ProjMatrix");

    projMatrix = ortho(-2, 2, -2, 2, -2, 2 );

    var eye = vec3(0.20,0.25,0.25);
    var at = vec3(0.0,0.0,0.0);
    var up = vec3(0.0,1.0,0.0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, flatten(lookAt(eye, at, up)));
    gl.uniformMatrix4fv(u_ProjMatrix, false, flatten(projMatrix));


    //event listeners for buttons

    document.getElementById( "xButton" ).onclick = function () {
        $( "#eixo" ).val("Girando em torno do eixo X");
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        $( "#eixo" ).val("Girando em torno do eixo Y");
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        $( "#eixo" ).val("Girando em torno do eixo Z");
        axis = zAxis;
    };

    $('#radio-1').change(function() {
        projMatrix = ortho(-2, 2, -2, 2, -2, 2 );
    });
    $('#radio-2').change(function() {
        projMatrix = perspective( 180.0, 1.0, -1.0, 100.0 );
    });



    $( "#eixo" ).val("Girando em torno do eixo X");

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
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    ];

    render();
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

    theta[axis] += 2.0;

    if(theta[axis]==360.0){
        theta[axis] = 0.0;
    }

    /*theta[yAxis] = 224;
    theta[zAxis] = 58;

     // TODO Verificar possível problema com esses caras fixos

     // [x variando, 266, 286] - tb com problema
    */

    gl.uniformMatrix4fv(u_ProjMatrix, false, flatten(projMatrix));

    gl.uniform3fv(thetaLoc, theta);

    gl.uniform1i(u_TipoDesenho, 0);

    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cores_dos_eixos), gl.STATIC_DRAW );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(eixos), gl.STATIC_DRAW );

    for(var i = 0; i<cores_dos_eixos.length; i=i+2){
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


    for(i = 0; i<cores_das_retas_paralelas.length; i=i+2){
       // gl.drawArrays( gl.LINES, i, 2 );
    }


    requestAnimFrame( render );
}
