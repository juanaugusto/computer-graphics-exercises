/**
 * Created by jaugusto on 12/3/16.
 */

window.onload = function(){
    clock = new THREE.Clock();
    treeGroup = new THREE.Group();

    scene1 = new THREE.Scene();
    //camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(0, 100, 500);
    //camera.position.z = 1500;

    scene1 = new THREE.Scene();

    //scene1.fog = new THREE.Fog( 0xf2f7ff, 1, 25000 );

    scene1.fog = new THREE.Fog( 0x87ceeb, 1, 25000 );

    scene1.add( new THREE.AmbientLight( 0xeef0ff ) );

    var light1 = new THREE.DirectionalLight( 0xffffff, 2 );
    light1.position.set( 1, 1, 1 );
    scene1.add( light1 );



    //

    textureLoader = new THREE.TextureLoader();

    var maxAnisotropy = renderer.getMaxAnisotropy();

    var texture1 = textureLoader.load( "img/floor-texture-2.jpg" );
    var material1 = new THREE.MeshPhongMaterial( { color:0x777777 /*0x8b8989*/, specular: 0x111111, map: texture1 } );

    texture1.anisotropy = maxAnisotropy;
    texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
    texture1.repeat.set(25, 25 );




    //
    //var geometry = new THREE.PlaneBufferGeometry( 100, 100 );

    //var geometry = new THREE.PlaneBufferGeometry(200,200);

    var geometry = new THREE.PlaneGeometry(20000,20000);
    var mesh1 = new THREE.Mesh( geometry, material1 );
    //mesh1.rotation.x = - Math.PI / 2;
    //mesh1.scale.set( 1000, 1000, 1000 );

    mesh1.position.y = - 150;
    mesh1.rotation.x = - Math.PI/2;
    scene1.add( mesh1 );


    // create the particle variables
    particleCount = 1800;
    particles = new THREE.Geometry();

    var textureSnow = new THREE.TextureLoader().load( "img/particle.jpg" );
    textureSnow.wrapS = THREE.RepeatWrapping;
    textureSnow.wrapT = THREE.RepeatWrapping;
    textureSnow.repeat.set( 4, 4 );


    var pMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 20,
            map:textureSnow,
            blending: THREE.AdditiveBlending,
            transparent: true
        });



    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        // create a particle with random
        // position values, -250 -> 250
        var pX = Math.random() * 2000 - 500;
        var pY = Math.random() * 2000 - 500;
        var pZ = Math.random() * 2000 - 500;
        var particle = new THREE.Vector3(pX, pY, pZ);


        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    particleSystem = new THREE.Points(
        particles,
        pMaterial);

    particleSystem.sortParticles = true;


    // add it to the scene
    scene1.add(particleSystem);

    //

    renderer.setClearColor( scene1.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    renderer.autoClear = false;



    var audio = document.createElement('audio');
    var source = document.createElement('source');
    source.src = 'sounds/christmas.mp3';
    audio.appendChild(source);
    //audio.play();

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    scene1.add( new THREE.AmbientLight(0x222222));

    // add particle of light
    particleLight = new THREE.Mesh( new THREE.SphereGeometry(5, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    particleLight.position.y = 250;
    treeGroup.add(particleLight);

    // add flying pint light
    pointLight = new THREE.PointLight(0xffffff, 1, 1000);
    treeGroup.add(pointLight);

    pointLight.position = particleLight.position;

    // add directional blue light
    directionalLight = new THREE.DirectionalLight(0x0000ff, 2);
    directionalLight.position.set(10, 1, 1).normalize();
    treeGroup.add(directionalLight);

    // model

    onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };
    onError = function ( xhr ) { };
    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'models/' );

    var files_gift_box_colors = ['gift_box_red.mtl', 'gift_box_blue.mtl', 'gift_box_green.mtl', 'gift_box_golden.mtl'];

    var gift_box_positions = [
        [100,-150,-100],
        [-100,-150,-100],
        [-100,-150,100],
        [100,-150,100]


    ];

    var i;
    for (i = 0; i<files_gift_box_colors.length; i++){

            mtlLoader.load(files_gift_box_colors[i], function( materials ) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.setPath( 'models/' );
            objLoader.load( 'gift_box.obj', function ( object ) {
                acesso++;
                object.position.x = gift_box_positions[acesso][0];
                object.position.y = gift_box_positions[acesso][1];
                object.position.z = gift_box_positions[acesso][2];

                object.rotation.x = -Math.PI / 2;

                object.scale.set(0.8,0.8,0.8);

                scene1.add( object );
            }, onProgress, onError );
        });
    }

    var manager = new THREE.LoadingManager();

    var texture = new THREE.Texture();

    var loader = new THREE.ImageLoader( manager );
    loader.load( 'textures/ball.jpg', function ( image ) {

        texture.image = image;
        texture.needsUpdate = true;

    } );

    var loader = new THREE.OBJLoader( manager );
    loader.load( 'models/ball.obj', function ( object ) {

        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

                child.material.map = texture;

            }

        } );

        object.position.y = - 95;
        object.position.x = - 155;
        object.scale.set(0.1,0.1,0.1);

        //scene1.add( object );

        ball_mesh = object;

        refreshTree();

        animate();



    }, onProgress, onError );




};


function animate() {

    // add some rotation to the system



    requestAnimationFrame( animate );

    render();


}

function render() {
    //camera.position.x += ( mouseX - camera.position.x ) * .05;
    //camera.position.y = THREE.Math.clamp( camera.position.y + ( - ( mouseY - 200 ) - camera.position.y ) * .05, 50, 1000 );

    //camera.lookAt( scene1.position );

    particleSystem.rotation.x += 0.01;

    renderer.clear();



    //refreshTree();

    //treeGroup.rotation.y -= clock.getDelta() * 0.5;

    var timer = Date.now() * 0.00025;
    treeGroup.rotation.y += (targetRotation - treeGroup.rotation.y) * 0.01;
    //particleLight.position.x = Math.sin(timer * 7) * 300;
    //particleLight.position.z = Math.cos(timer * 3) * 300;
    camera.position.x = Math.cos(timer) * 1000;
    camera.position.z = Math.sin(timer) * 500;
    camera.lookAt(scene1.position);

    renderer.render( scene1, camera );


}


function makeSection(botWidth, topWidth, height, translateY, shiftX, shiftY){
    var geom = new THREE.Geometry();


    for(var xx=-1; xx <= 1; xx+=2){
        var v1 = new THREE.Vector3(xx*botWidth/2         , 0      + translateY, -botWidth/2);
        console.log(v1);
        var v2 = new THREE.Vector3(xx*topWidth/2 + shiftX, height + translateY, -topWidth/2  + shiftY);
        var v3 = new THREE.Vector3(xx*topWidth/2 + shiftX, height + translateY,  topWidth/2  + shiftY);
        var v4 = new THREE.Vector3(xx*botWidth/2         , 0      + translateY,  botWidth/2);

        geom.vertices.push(v1);
        geom.vertices.push(v2);
        geom.vertices.push(v3);
        geom.vertices.push(v4);
    }
    geom.faces.push( new THREE.Face3( 1, 0, 2 ) );
    geom.faces.push( new THREE.Face3( 2, 0, 3 ) );

    geom.faces.push( new THREE.Face3( 4, 5, 6 ) );
    geom.faces.push( new THREE.Face3( 4, 6, 7 ) );

    geom.faces.push( new THREE.Face3( 3, 7, 6 ) );
    geom.faces.push( new THREE.Face3( 2, 3, 6 ) );

    geom.faces.push( new THREE.Face3( 1, 4, 0 ) );
    geom.faces.push( new THREE.Face3( 1, 5, 4 ) );

    geom.myData = "fdnsjkfdnjsk";

    geom.computeFaceNormals();
    return geom;
}


function makeTree(scene){

    var scale = 150;

    //Build utility variables
    var isTrunk = true; // initially make a trunk then make the rest of the tree
    var lastHeight = 0;
    var sections = 7;
    //var heights = [54,60,63,66,68,69,71];

    var heights = [54,60,63,66,68,69,71];

    //var heights = [ 80,80,80,80,80,80,80];
    var currentHeight = 0;//-heights[0] / 2;
    //var widths = [372.245046479392,252.19076427505215 ,149.88792298482537, 101.9350748994837,71.37881792953567, 39.041810196524466, 25,0];

    var widths = [372.245046479392,156.19076427505215 ,149.88792298482537, 101.9350748994837,71.37881792953567, 39.041810196524466, 25,0];

    //console.log(heights);

    for(var trunkIndex = 0; trunkIndex < sections; trunkIndex ++){
        var height = heights[trunkIndex];
        var botWidth = widths[trunkIndex];
        var topWidth = widths[trunkIndex + 1] / 2;

        var cubeMaterial = new THREE.MeshLambertMaterial({
            color: 0x1B5E20
        });

        //cube.position.y += currentHeight;
        currentHeight += height * 0.75;


        var geom;
        if(isTrunk){
            geom = makeSection(topWidth / 3, topWidth / 5, height,currentHeight , 0, 0);
            cubeMaterial = new THREE.MeshLambertMaterial({
                color: 0x4E342E
            });


            isTrunk = false;
        }
        else{
            geom = makeSection(botWidth, topWidth, height,currentHeight, 0, 0);




        }



        var cube = new THREE.Mesh(geom, cubeMaterial);

        //Main rotation (original before spin)
        //cube.rotation.y = Math.PI * (Math.random() * 90) / 180;
        //console.log(currentHeight);


        for(var idx in cube.vertices){
            cube.vertices[idx].position.y += currentHeight;
        }

        //add shadows
        cube.castShadow = true;
        cube.receiveShadow = false;



        //Add the cube to the scene
        scene.add(cube);

        if(!isTrunk){
            var i = 0;

            var min = 0;

            for (i=0; i< geom.vertices.length; i=i+1){

                var v = geom.vertices[i];

                if (i==0){
                    min = v.y;
                }else{
                    if (v.y<min){
                        min = v.y;
                    }
                }

            }


            for (i=0; i< geom.vertices.length; i=i+1){

                var v = geom.vertices[i];

                var bm = ball_mesh.clone();
                if(v.y == min){
                    bm.position.set(v.x, v.y, v.z);
                }
                scene.add(bm);

            }

        }

    }

    // add the star
    var starOpts = {
        amount: 4,
        bevelEnabled: false
    };

    var imgTexture = textureLoader.load('img/star-texture.jpg');
    imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
    imgTexture.anisotropy = 16;
    imgTexture.needsUpdate = true;

    var shading = THREE.SmoothShading;

    var material_star = new THREE.MeshLambertMaterial({color: 0xC80815    });

    //var material_star =  new THREE.MeshPhongMaterial( {color: 0xff0000, ambient: 0xffffff } );
    scene = addBranch(5, 0, 420, -2, starOpts, material_star, false, scene);

    return scene;
    //scene.position.y = - currentHeight/2;

}

function refreshTree(){
    scene1.remove(treeGroup);
    var rotY = treeGroup.rotation.y;
    treeGroup = new THREE.Group();
    treeGroup = makeTree(treeGroup);
    treeGroup.rotation.y = rotY;

    treeGroup.translateY(-210);
    scene1.add(treeGroup);
}



function onDocumentMouseDown(event) {
    event.preventDefault();
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);
    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
}
function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
}
function onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}
function onDocumentMouseOut(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}
function onDocumentTouchStart(event) {
    if (event.touches.length == 1) {
        event.preventDefault();
        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
        targetRotationOnMouseDown = targetRotation;
    }
}
function onDocumentTouchMove(event) {
    if (event.touches.length == 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
    }
}

function addBranch(count, x, y, z, opts, material, rotate, scene) {
// prepare star-like points
    var points = [], l;
    for (i = 0; i < count * 2; i++) {
        if (i % 2 == 1) {
            l = count * 2;
        } else {
            l = count * 4;
        }
        var a = i / count * Math.PI;
        points.push( new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));
    }
    var branchShape = new THREE.Shape(points);
    var branchGeometry = new THREE.ExtrudeGeometry(branchShape, opts);
    var branchMesh = new THREE.Mesh(branchGeometry, material);
    branchMesh.position.set(x, y, z);
    // rotate 90 degrees
    if (rotate) {
        branchMesh.rotation.set(Math.PI / 2, 0, 0);
    } else {
        branchMesh.rotation.set(0, 0, Math.PI / 2);
    }
    //add shadows
    branchMesh.castShadow = true;
    branchMesh.receiveShadow = false;
    // add branch to the group
    scene.add(branchMesh);

    return scene;
}





