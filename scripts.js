var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

camera.position.z = 5;
camera.position.y-=19;

//camera.position.z =150;


var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;


var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 0, 100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 0, 100);

var up_light = new THREE.PointLight( 0xffffff, 30, 200 ,10);
up_light.position.set( 50, 100, 50 );

var down_light = new THREE.PointLight( 0xffffff, 5, 100 );
down_light.position.set( 50, -100, 50 );

var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);
scene.add(up_light);
scene.add(down_light);

var cubePosition;
var cubeSize;


var geometry_plane = new THREE.PlaneGeometry( 90, 90, 32 );
var texture = new THREE.TextureLoader().load( 'assets/270.png' );

var material = new THREE.MeshBasicMaterial( {map: texture} );
var texture_sky = new THREE.TextureLoader().load( 'assets/3.png' );


var plane = new THREE.Mesh( geometry_plane, material );
scene.add( plane );

var geometry = new THREE.SphereGeometry( 5, 32, 32 );
var material = new THREE.MeshBasicMaterial( {map: texture_sky} );
var body = new THREE.Mesh( geometry, material );
body.position.y-=15;
body.position.z+=1;
body.scale.set(0.26,0.26,0.26);
scene.add( body );

var animate = function () {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render(scene, camera);
};



animate();