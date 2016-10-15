/**
 * Created by jaugusto on 10/4/16.
 */
"use strict";

var canvas;
var gl;
var theta = 0;

var theta_varGL;
var points = [];

var NumTimesToSubdivide = 0;

var fColor;
const black = vec4(0.0, 0.0, 0.0, 1.0);
const red = vec4(1.0, 0.0, 0.0, 1.0);

window.onload = function init()
{
    $( "#slider_angulo" ).slider({
        min: -360,
        max: 360,
        value: theta,
        range: "min",
        slide: function( event, ui ) {
            $( "#angulo" ).val( ui.value + "º" );
            theta = ui.value;

            render();
        }
    });



    $( "#angulo" ).val($( "#slider_angulo" ).slider( "value" ) + "º");

    $( "#slider_num_subdivisoes" ).slider({
        min: 0,
        max: 8,
        value: NumTimesToSubdivide,
        range: "min",
        slide: function( event, ui ) {
            $( "#num_subdivisoes" ).val( ui.value);
            NumTimesToSubdivide = ui.value;
            points = [];
            var vertices = [
                vec2( -0.5, -0.5 ),
                vec2(  0,  0.5 ),
                vec2(  0.5, -0.5 )
            ];

            divideTriangle2( vertices[0], vertices[1], vertices[2], NumTimesToSubdivide);

            gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
            gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

            //var vPosition = gl.getAttribLocation( program, "vPosition" );
            //gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
            //gl.enableVertexAttribArray( vPosition );

            render();
        }
    });

    $( "#num_subdivisoes" ).val($( "#slider_num_subdivisoes" ).slider( "value" ) );

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2( -0.5, -0.5 ),
        vec2(  0,  0.5 ),
        vec2(  0.5, -0.5 )
    ];


    divideTriangle2( vertices[0], vertices[1], vertices[2], NumTimesToSubdivide);
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    theta_varGL = gl.getUniformLocation( program, "theta" );
    fColor = gl.getUniformLocation(program, "fColor");

    render();
};

function divideTriangle2( a, b, c, count )
{

    // check for end of recursion
    // if end then add vertices of triangle to points array

    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        // decrement remaining recursive steps

        count--;

        // four new triangles

        divideTriangle2( a, ab, ac, count );
        divideTriangle2( c, ac, bc, count );
        divideTriangle2( b, bc, ab, count );
        divideTriangle2(ab, ac, bc, count );
    }
}

function triangle( a, b, c )
{
    points.push( a, b, c );
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT |  gl.DEPTH_BUFFER_BIT);

    gl.uniform1i( theta_varGL, theta );

    gl.uniform4fv(fColor, flatten(red));
    //uncomment next line to render with lines
    gl.drawArrays( gl.POINTS, 0, points.length );




}


