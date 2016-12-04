/**
 * Created by jaugusto on 12/3/16.
 */

var scene1;
var scene2;
var camera;
var renderer;

var geometry;
var material;
var cube;

var mesh;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container,stats;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var textureLoader;

var particleSystem;

var particleCount;

var particles;

var clock;

var treeGroup;

var sections, heights, widths;

var targetRotation = 0;

var mouseXOnMouseDown;
var targetRotationOnMouseDown;

var particleLight;
var pointLight;
var direcionalLight;
