/*
 Nome(s): Jéssica Genta dos Santos - 111031073
 Juan Augusto Santos de Paula - 111222844
 */

window.onload = function () {
    clock = new THREE.Clock();
    treeGroup = new THREE.Group();

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 100, 500);

    scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0x87ceeb, 1, 25000);

    scene.add(new THREE.AmbientLight(0xeef0ff));

    var light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(150, 100, 200);
    scene.add(light);

    textureLoader = new THREE.TextureLoader();

    var maxAnisotropy = renderer.getMaxAnisotropy();

    var texture_floor = new THREE.TextureLoader().load("img/floor-texture.jpg");
    var material_floor = new THREE.MeshPhongMaterial({color: 0x777777, specular: 0x111111, map: texture_floor});

    texture_floor.anisotropy = maxAnisotropy;
    texture_floor.wrapS = texture_floor.wrapT = THREE.RepeatWrapping;
    texture_floor.repeat.set(100, 100);


    var geometry_floor = new THREE.PlaneGeometry(1000, 1000);
    var mesh_floor = new THREE.Mesh(geometry_floor, material_floor);
    mesh_floor.position.y = -200;
    mesh_floor.rotation.x = -Math.PI / 2;
    scene.add(mesh_floor);


    // create the particle variables
    particleCount = 1800;
    particles = new THREE.Geometry();

    var pMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 25,
        map: new THREE.TextureLoader().load("img/snowflake.png"),
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });

    // creating individual particles
    for (var p = 0; p < particleCount; p++) {

        // creating random particle system
        var pX = Math.random() * 2000 - 500;
        var pY = Math.random() * 2000 - 500;
        var pZ = Math.random() * 2000 - 500;
        var particle = new THREE.Vector3(pX, pY, pZ);

        particles.vertices.push(particle);
    }

    // create the particle system
    particleSystem = new THREE.Points(
        particles,
        pMaterial);

    particleSystem.sortParticles = true;

    scene.add(particleSystem);

    renderer.setClearColor(scene.fog.color);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.autoClear = false;

    play_audio();

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    scene.add(new THREE.AmbientLight(0x222222));

    // add particle of light
    particleLight = new THREE.Mesh(new THREE.SphereGeometry(5, 10, 10), new THREE.MeshBasicMaterial({color: 0xffffff}));
    particleLight.position.y = 250;
    treeGroup.add(particleLight);

    // add flying pint light
    pointLight = new THREE.PointLight(0xffffff, 1, 1000);
    treeGroup.add(pointLight);

    pointLight.position = particleLight.position;

    // add directional blue light
    directionalLight = new THREE.DirectionalLight(0x0000ff, 2);
    directionalLight.position.set(150, 200, 170).normalize();
    treeGroup.add(directionalLight);

    // models and texture load

    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('models/');

    var files_gift_box_colors = ['gift_box_red.mtl', 'gift_box_blue.mtl', 'gift_box_green.mtl', 'gift_box_golden.mtl'];

    var gift_box_positions = [
        [100, -200, -100],
        [-100, -200, -100],
        [-100, -200, 100],
        [100, -200, 100]


    ];

    var i;
    for (i = 0; i < files_gift_box_colors.length; i++) {

        mtlLoader.load(files_gift_box_colors[i], function (materials) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('models/');
            objLoader.load('gift_box.obj', function (object) {
                acesso++;
                object.position.x = gift_box_positions[acesso][0];
                object.position.y = gift_box_positions[acesso][1];
                object.position.z = gift_box_positions[acesso][2];

                object.rotation.x = -Math.PI / 2;

                object.scale.set(0.8, 0.8, 0.8);

                scene.add(object);
            }, onProgress, onError);
        });
    }

    mtlLoader.load('snowman.mtl', function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('models/');
        objLoader.load('snowman.obj', function (object) {

            object.position.x = -300;
            object.position.y = -150;
            object.position.z = 0;

            object.scale.set(20, 20, 20);


            scene.add(object);
        }, onProgress, onError);
    });

    var spear_positions = [
        [400, 0, 0, 0],
        [-400, 0, 0, 0],
        [0, 293, 0, Math.PI / 2]
    ];

    for (i = 0; i < spear_positions.length; i++) {
        mtlLoader.load('spear.mtl', function (materials) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('models/');
            objLoader.load('spear.obj', function (object) {
                acesso2++;

                object.position.x = spear_positions[acesso2][0];
                object.position.y = spear_positions[acesso2][1];
                object.position.z = spear_positions[acesso2][2];

                if (spear_positions[acesso2][3] != 0) {
                    object.scale.set(40, 40, 233);
                    object.rotation.y = spear_positions[acesso2][3];


                } else {
                    object.rotation.x = -Math.PI / 2;
                    object.scale.set(40, 40, 170);


                }

                scene.add(object);
            }, onProgress, onError);
        });
    }

    mtlLoader.load('snowman.mtl', function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('models/');
        objLoader.load('snowman.obj', function (object) {

            object.position.x = -300;
            object.position.y = -100;
            object.position.z = 0;

            object.scale.set(20, 20, 20);


            scene.add(object);
        }, onProgress, onError);
    });

    var manager = new THREE.LoadingManager();

    texture_red_bulb = new THREE.TextureLoader().load("textures/red_light.jpg");
    texture_red_bulb.wrapS = THREE.RepeatWrapping;
    texture_red_bulb.wrapT = THREE.RepeatWrapping;
    texture_red_bulb.repeat.set(4, 4);

    texture_green_bulb = new THREE.TextureLoader().load("textures/green_light.jpg");
    texture_green_bulb.wrapS = THREE.RepeatWrapping;
    texture_green_bulb.wrapT = THREE.RepeatWrapping;
    texture_green_bulb.repeat.set(4, 4);

    texture_blue_bulb = new THREE.TextureLoader().load("textures/blue_light.jpg");
    texture_blue_bulb.wrapS = THREE.RepeatWrapping;
    texture_blue_bulb.wrapT = THREE.RepeatWrapping;
    texture_blue_bulb.repeat.set(4, 4);

    var texture = new THREE.Texture();

    var loader = new THREE.ImageLoader(manager);
    loader.load('textures/ball.jpg', function (image) {

        texture.image = image;
        texture.needsUpdate = true;

    });

    var loader = new THREE.OBJLoader(manager);
    loader.load('models/ball.obj', function (object) {

        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {

                child.material.map = texture;

            }

        });

        object.position.y = 150;
        object.position.x = 0;
        object.scale.set(0.1, 0.1, 0.1);

        object.castShadow = true;
        object.receiveShadow = false;

        ball_mesh = object;

    }, onProgress, onError);

    var loader = new THREE.OBJLoader(manager);
    loader.load('models/lightbulb.obj', function (object) {

        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {

                child.material.map = texture_blue_bulb;
                child.material.needsUpdate = true;

                bulb = child;

            }

        });

        object.scale.set(3, 3, 3);

        object.rotation.x = Math.PI;

        bulb_mesh = object;

        for (var i = 0; i < bulb_positions.length; i++) {
            var bm = bulb_mesh.clone();
            bm.position.set(bulb_positions[i][0], bulb_positions[i][1], bulb_positions[i][2]);
            scene.add(bm);
        }

        treeGroup = makeTree();
        scene.add(treeGroup);

        var imagePrefix = "img/skybox/";
        var directions = ["posx", "negx", "posy", "negy", "posz", "negz"];
        var imageSuffix = ".jpg";
        var skyGeometry = new THREE.CubeGeometry(5000, 5000, 5000);

        var materialArray = [];
        for (var i = 0; i < 6; i++)
            materialArray.push(new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(imagePrefix + directions[i] + imageSuffix),
                side: THREE.BackSide
            }));
        var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
        var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);

        scene.add(skyBox);

        animate();

    }, onProgress, onError);

};

function play_audio() {

    var audio = document.createElement('audio');
    var source = document.createElement('source');
    source.src = 'sounds/christmas.mp3';
    audio.appendChild(source);
    audio.play();
}

function animate() {

    requestAnimationFrame(animate);

    render();

}

function render() {

    renderer.clear();

    particleSystem.rotation.x += 0.01;

    if (bulb) {
        var array_tex = [texture_red_bulb, texture_blue_bulb, texture_green_bulb];

        for (var i = 0; i < scene.children.length; i++) {
            if(scene.children[i].children.length==8){
                if(scene.children[i].children[0].name == "Lightbulb_bottom"){
                    var text_rand = array_tex[parseInt(Math.random() * 3)];
                    for (var j = 0; j < scene.children[i].children.length; j++) {
                        scene.children[i].children[j].material.map = text_rand;
                        scene.children[i].children[j].material.needsUpdate = true;
                    }
                }

            }

        }
    }

    var timer = Date.now() * 0.00025;
    treeGroup.rotation.y += (targetRotation - treeGroup.rotation.y) * 0.01;

    camera.position.x = Math.cos(timer) * 1000;
    camera.position.z = Math.sin(timer) * 500;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);

}

function makeSection(botWidth, topWidth, height, translateY, shiftX, shiftY) {

    var geom = new THREE.Geometry();

    for (var xx = -1; xx <= 1; xx += 2) {
        var v1 = new THREE.Vector3(xx * botWidth / 2, 0 + translateY, -botWidth / 2);
        var v2 = new THREE.Vector3(xx * topWidth / 2 + shiftX, height + translateY, -topWidth / 2 + shiftY);
        var v3 = new THREE.Vector3(xx * topWidth / 2 + shiftX, height + translateY, topWidth / 2 + shiftY);
        var v4 = new THREE.Vector3(xx * botWidth / 2, 0 + translateY, botWidth / 2);

        geom.vertices.push(v1);
        geom.vertices.push(v2);
        geom.vertices.push(v3);
        geom.vertices.push(v4);
    }
    geom.faces.push(new THREE.Face3(1, 0, 2));
    geom.faces.push(new THREE.Face3(2, 0, 3));

    geom.faces.push(new THREE.Face3(4, 5, 6));
    geom.faces.push(new THREE.Face3(4, 6, 7));

    geom.faces.push(new THREE.Face3(3, 7, 6));
    geom.faces.push(new THREE.Face3(2, 3, 6));

    geom.faces.push(new THREE.Face3(1, 4, 0));
    geom.faces.push(new THREE.Face3(1, 5, 4));

    geom.myData = "fdnsjkfdnjsk";

    geom.computeFaceNormals();
    return geom;
}


function makeTree() {

    var group = new THREE.Group();

    var scale = 150;

    var isTrunk = true; // initially make a trunk then make the rest of the tree
    var lastHeight = 0;
    var sections = 7;

    var heights = [54, 60, 63, 66, 68, 69, 71];

    var currentHeight = 0;

    var widths = [372.245046479392, 156.19076427505215, 149.88792298482537, 101.9350748994837, 71.37881792953567, 39.041810196524466, 25, 0];

    for (var trunkIndex = 0; trunkIndex < sections; trunkIndex++) {
        var height = heights[trunkIndex];
        var botWidth = widths[trunkIndex];
        var topWidth = widths[trunkIndex + 1] / 2;

        var cubeMaterial = new THREE.MeshLambertMaterial({
            color: 0x1B5E20
        });

        currentHeight += height * 0.75;

        var geom;
        if (isTrunk) {
            geom = makeSection(topWidth / 3, topWidth / 5, height, currentHeight, 0, 0);
            cubeMaterial = new THREE.MeshLambertMaterial({
                color: 0x4E342E
            });

            isTrunk = false;
        }
        else {
            geom = makeSection(botWidth, topWidth, height, currentHeight, 0, 0);
            var i = 0;
            var min = 0;
            var v;
            for (i = 0; i < geom.vertices.length; i = i + 1) {
                v = geom.vertices[i];

                if (i == 0) {
                    min = v.y;
                } else if (v.y < min) {
                    min = v.y;
                }
            }

            for (i = 0; i < geom.vertices.length; i = i + 1) {
                v = geom.vertices[i];

                var bm = ball_mesh.clone();
                if (v.y == min) {
                    bm.position.set(v.x, v.y, v.z);
                }
                group.add(bm);
            }
        }

        var cube = new THREE.Mesh(geom, cubeMaterial);

        for (var idx in cube.vertices) {
            cube.vertices[idx].position.y += currentHeight;
        }

        //add shadows
        cube.castShadow = true;
        cube.receiveShadow = false;

        group.add(cube);

    }

    // add the star
    var starOpts = {
        amount: 4,
        bevelEnabled: false
    };


    var shading = THREE.SmoothShading;

    var material_star = new THREE.MeshLambertMaterial({color: 0xC80815});

    group = addBranch(5, 0, 420, -2, starOpts, material_star, false, group);

    group.translateY(-240);

    return group;
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
        points.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));
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

var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};
var onError = function (xhr) {

};




