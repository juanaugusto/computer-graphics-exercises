/*
 Nome(s): Jéssica Genta dos Santos - 111031073
 Juan Augusto Santos de Paula - 111222844

 */

var scene;
var camera;
var renderer;

var geometry;
var material;
var cube;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var textureLoader;

var particleSystem;

var particleCount;

var particles;

var clock;

var treeGroup;

var targetRotation = 0;

var mouseXOnMouseDown = 0;
var targetRotationOnMouseDown = 0;

var particleLight;
var pointLight;


var acesso = -1;

var ball_mesh = null;

var acesso2 = -1;

var bulb = null;

var bulb_mesh = null;

var texture_blue_bulb, texture_green_bulb, texture_red_bulb;

var bulb_positions = [

    [-350,293,0],
    [-300,293,0],
    [-250,293,0],
    [-200,293,0],
    [-150,293,0],
    [-100,293,0],
    [-50,293,0],
    [0,293,0],
    [50,293,0],
    [100,293,0],
    [150,293,0],
    [200,293,0],
    [250,293,0],
    [300,293,0],
    [350,293,0]
];



