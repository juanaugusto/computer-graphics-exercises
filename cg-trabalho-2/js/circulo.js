
var raio = 1;
var comp_circulo = 2*Math.PI*raio;
var num_divisoes = 12;
var angulo_dividido = (2*Math.PI)/num_divisoes;
var points = [];
var points_sem_centro = [];
var points_com_um_centro = [];
var fColor;
const teal_color = vec4(0, 0.545, 0.545, 0.2);
const dark_green_color = vec4(0, 0.392, 0, 1.0);

$(document).ready(function () {

    $( "#slider_num_divisoes" ).slider({
        min: 3,
        max: 20,
        value: num_divisoes,
        range: "min",
        slide: function( event, ui ) {
            $( "#num_divisoes" ).val( ui.value);
            num_divisoes = ui.value;
            points = divideCirculo(num_divisoes, false);
            points_sem_centro = divideCirculo(num_divisoes, true);
            points_com_um_centro = divideCirculo(num_divisoes, true);
            points_com_um_centro.push([1,0]);
            points_com_um_centro.unshift([0,0]);

            render();
        }
    });

    $( "#num_divisoes" ).val($( "#slider_num_divisoes" ).slider( "value" ) );

    var projMatrix = ortho(-2.0, 2.0, -2.0, 2.0, -1.0, 1.0);

    canvas = document.getElementById( "gl-canvas" );


    gl = WebGLUtils.setupWebGL( canvas );

    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    //gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.clearColor(0.4, 0.4, 0.75, 0.6);


    // Load the data into the GPU

    points = divideCirculo(num_divisoes, false);
    points_sem_centro = divideCirculo(num_divisoes, true);
    points_com_um_centro = divideCirculo(num_divisoes, true);
    points_com_um_centro.push([1,0]);
    points_com_um_centro.unshift([0,0]);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );


    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    fColor = gl.getUniformLocation(program, "fColor");

    u_ProjMatrix = gl.getUniformLocation(program,'u_ProjMatrix');

    gl.uniformMatrix4fv(u_ProjMatrix, false, flatten(projMatrix));


    render();


});

function divideCirculo(num_divisoes, sem_centro){
    var vertices = [

    ];

    var angulo_dividido = 2*Math.PI/num_divisoes;
    var angulo = angulo_dividido;

    if(!sem_centro){
        vertices.push([0, 0]);
    }
    vertices.push([1,0])

    for(var i = 0; i<num_divisoes; i++){
        if(angulo>=0 && angulo<=Math.PI/2){  //primeiro quadrante
            if(!sem_centro){
                vertices.push([0, 0]);
            }
            vertices.push(vec2(Math.cos(angulo)*raio, Math.sin(angulo)*raio));

        }else if(angulo>Math.PI/2 && angulo<=Math.PI){ //segundo quadrante
            if(!sem_centro) {
                vertices.push([0, 0]);
            }
            vertices.push(vec2(-Math.sin(angulo-Math.PI/2)*raio, Math.cos(angulo-Math.PI/2)*raio));


        }else if(angulo>Math.PI && angulo<=3*Math.PI/2){ // terceiro quadrante
            if(!sem_centro) {
                vertices.push([0, 0]);
            }
            vertices.push(vec2(-Math.cos(angulo-Math.PI)*raio, -Math.sin(angulo-Math.PI)*raio));

        }else if(angulo>3*Math.PI/2 && angulo < 2*Math.PI){ // quarto quadrante
            if(!sem_centro) {
                vertices.push([0, 0]);
            }
            vertices.push(vec2(Math.sin(angulo-3*Math.PI/2)*raio, -Math.cos(angulo-3*Math.PI/2)*raio));
        }

        angulo+=angulo_dividido;
    }

    return vertices;

}

function render()
{
    //gl.clear( gl.COLOR_BUFFER_BIT |  gl.DEPTH_BUFFER_BIT);
    gl.clear( gl.COLOR_BUFFER_BIT);

    gl.uniform4fv(fColor, flatten(teal_color));

    gl.bufferData( gl.ARRAY_BUFFER, flatten(points_com_um_centro), gl.STATIC_DRAW );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, points_com_um_centro.length );

    gl.uniform4fv(fColor, flatten(dark_green_color));

    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    gl.drawArrays( gl.LINES, 0, points.length );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(points_sem_centro), gl.STATIC_DRAW );

    gl.drawArrays( gl.LINE_LOOP, 0, points_sem_centro.length );






}


