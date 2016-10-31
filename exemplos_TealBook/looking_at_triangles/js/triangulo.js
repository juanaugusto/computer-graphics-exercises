
$(document).ready(function () {

    var canvas = document.getElementById("gl-canvas");

    var proj_matrix = ortho(-3.0, 3.0, -3.0, 3.0, -3.0, 3.0);

    var gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.05, 0.05, 0.05, 0.2);

    gl.clear(gl.COLOR_BUFFER_BIT);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var eixos = [
        vec3(0.0, 0.0, 0.0),
        vec3(1.0, 0.0, 0.0), // eixo X
        vec3(0.0, 0.0, 0.0),
        vec3(0.0, 1.0, 0.0), // eixo Y
        vec3(0.0, 0.0, 0.0),
        vec3(0.0, 0.0, 1.0) // eixo Z

    ];

    var cores_dos_eixos = [
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        vec3(0, 0, 0)
    ];


    var vertices = [

        vec3(1.0,1.0,1.0),
        vec3(-1.0,1.0,1.0),
        vec3(-1.0,-1.0,1.0),
        vec3(1.0,-1.0,1.0),
        vec3(1.0,-1.0,-1.0),
        vec3(1.0,1.0,-1.0),
        vec3(-1.0,1.0,-1.0),
        vec3(-1.0,-1.0,-1.0)

    ];

    var cores_dos_vertices = [
        vec3(1.0,1.0,1.0),
        vec3(1.0,0.0,1.0),
        vec3(1.0,0.0,0.0),
        vec3(1.0,1.0,0.0),
        vec3(0.0,1.0,0.0),
        vec3(0.0,1.0,1.0),
        vec3(0.0,0.0,1.0),
        vec3(0.0,0.0,0.0)
    ];


    var buffer_points = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_points);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate shader vertex variable with data buffer
    var a_position = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_position);

    var buffer_colors = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_colors);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cores_dos_vertices), gl.STATIC_DRAW);

    // Associate shader vertex variable with data buffer
    var a_color = gl.getAttribLocation(program, "a_Color");
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_color);

    //Fazendo bind com as variaveis uniform dos shaders
    var u_view_matrix = gl.getUniformLocation(program,"u_ViewMatrix");


    var eye = vec3(0.0, 0.0, 0.0);
    var at = vec3(0.0, 0.0, 0.0);
    var up = vec3(0.0, 1.0, 0.0);
    var view_matrix = lookAt( eye, at, up );

    gl.uniformMatrix4fv(u_view_matrix, false, flatten(view_matrix));

    render( gl, u_view_matrix, lookAt( eye, at, up ));


    $( "#slider_eye_x" ).slider({
        min: -1000,
        max: 1000,
        value: 0,
        range: "min",
        slide: function( event, ui) {
            eye[0] = parseFloat(ui.value/1000);
            $( "#eye_x" ).val(eye[0].toString());
            view_matrix = lookAt( eye, at, up );

            render( gl, u_view_matrix, view_matrix);
        }
    });
    $( "#eye_x" ).val(parseFloat($( "#slider_eye_x" ).slider( "value" ))/1000);

    $( "#slider_eye_y" ).slider({
        min: -1000,
        max: 1000,
        value: 0,
        range: "min",
        slide: function( event, ui) {
            eye[1] = parseFloat(ui.value/1000);
            $( "#eye_y" ).val(eye[1].toString());
            render( gl, u_view_matrix, lookAt( eye, at, up ));

        }
    });
    $( "#eye_y" ).val(parseFloat($( "#slider_eye_y" ).slider( "value" ))/1000);

    $( "#slider_eye_z" ).slider({
        min: -1000,
        max: 1000,
        value: 0,
        range: "min",
        slide: function( event, ui) {
            eye[2] = parseFloat(ui.value/1000);
            $( "#eye_z" ).val(eye[2].toString());
            render( gl, u_view_matrix, lookAt( eye, at, up ));

        }
    });
    $( "#eye_z" ).val(parseFloat($( "#slider_eye_z" ).slider( "value" ))/1000);

    $( "#slider_look_at_x" ).slider({
        min: -1000,
        max: 1000,
        value: 0,
        range: "min",
        slide: function( event, ui) {
            at[0] = parseFloat(ui.value/1000);
            $( "#look_at_x" ).val(at[0].toString());
            render( gl, u_view_matrix, lookAt( eye, at, up ));
        }
    });
    $( "#look_at_x" ).val(parseFloat($( "#slider_look_at_x" ).slider( "value" ))/1000);

    $( "#slider_look_at_y" ).slider({
        min: -1000,
        max: 1000,
        value: 0,
        range: "min",
        slide: function( event, ui) {
            at[1] = parseFloat(ui.value/1000);
            $( "#look_at_y" ).val(at[1].toString());
            render( gl, u_view_matrix, lookAt( eye, at, up ));

        }
    });
    $( "#look_at_y" ).val(parseFloat($( "#slider_look_at_y" ).slider( "value" ))/1000);

    $( "#slider_look_at_z" ).slider({
        min: -1000,
        max: 1000,
        value: 0,
        range: "min",
        slide: function( event, ui) {
            at[2] = parseFloat(ui.value/1000);
            $( "#look_at_z" ).val(at[2].toString());
            render( gl, u_view_matrix, lookAt( eye, at, up ));

        }
    });
    $( "#look_at_z" ).val(parseFloat($( "#slider_look_at_z" ).slider( "value" ))/1000);

    $( "#slider_up_x" ).slider({
        min: -1000,
        max: 1000,
        value: 0,
        range: "min",
        slide: function( event, ui) {
            up[0] = parseFloat(ui.value/1000);
            $( "#up_x" ).val(up[0].toString());
            render( gl, u_view_matrix, lookAt( eye, at, up ));
        }
    });
    $( "#up_x" ).val(parseFloat($( "#slider_up_x" ).slider( "value" ))/1000);

    $( "#slider_up_y" ).slider({
        min: -1000,
        max: 1000,
        value: 1000,
        range: "min",
        slide: function( event, ui) {
            up[1] = parseFloat(ui.value/1000);
            $( "#up_y" ).val(up[1].toString());
            render( gl, u_view_matrix, lookAt( eye, at, up ));

        }
    });
    $( "#up_y" ).val(parseFloat($( "#slider_up_y" ).slider( "value" ))/1000);

    $( "#slider_up_z" ).slider({
        min: -1000,
        max: 1000,
        value: 0,
        range: "min",
        slide: function( event, ui) {
            up[2] = parseFloat(ui.value/1000);
            $( "#up_z" ).val(up[2].toString());
            render( gl, u_view_matrix, lookAt( eye, at, up ));

        }
    });
    $( "#up_z" ).val(parseFloat($( "#slider_up_z" ).slider( "value" ))/1000);


    function render(gl, u_view_matrix, view_matrix){

        gl.uniformMatrix4fv(u_view_matrix, false, flatten(view_matrix));


        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer_colors);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(cores_dos_eixos), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer_points);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(eixos), gl.STATIC_DRAW);
        var i;
        for(i = 0; i<eixos.length; i=i+2){
            gl.drawArrays(gl.LINES, i, 2);
        }


        /*gl.bindBuffer(gl.ARRAY_BUFFER, buffer_colors);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(cores_dos_vertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer_points);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

        gl.drawArrays(gl.TRIANGLES, 0, 9);*/
    }


});








