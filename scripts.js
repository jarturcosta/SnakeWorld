var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.z = 5;
camera.position.y -= 19;

//camera.position.z =150;


var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;


var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 0, 100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 0, 100);

var up_light = new THREE.PointLight(0xffffff, 30, 200, 10);
up_light.position.set(50, 100, 50);

var down_light = new THREE.PointLight(0xffffff, 5, 100);
down_light.position.set(50, -100, 50);

var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);
scene.add(up_light);
scene.add(down_light);

var cubePosition;
var cubeSize;
var moveSpeed = 0.2;
var turnSpeed = 0.1;

var geometry_plane = new THREE.PlaneGeometry(90, 90, 32);
var texture = new THREE.TextureLoader().load('assets/270.png');

var material = new THREE.MeshBasicMaterial({map: texture});
var texture_sky = new THREE.TextureLoader().load('assets/snek.jpg');

var plane = new THREE.Mesh(geometry_plane, material);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

var geometry = new THREE.SphereGeometry(5, 32, 32);
var material = new THREE.MeshBasicMaterial({map: texture_sky});
var body = new THREE.Mesh(geometry, material);
body.scale.set(0.26, 0.26, 0.26);

var i;
var snake = [];
var orders = [];
for (i = 1; i < 100; i++) {
    var temp = new THREE.Mesh(geometry, material);
    temp.scale.set(0.26, 0.26, 0.26);
    temp.position.z += i;
    scene.add(temp);
    snake.push(temp);
    orders.push([]);
}
//scene.add( body );
controls = new THREE.PlayerControls(camera, snake[0], snake);
controls.init();
console.log(snake);
var animate = function () {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        var x = snake[0].position.x;
        var y = snake[0].position.y;
        var z = snake[0].position.z;
        var order;
        //console.log(previous);
        controls.update();

        orders[0].push([x, y, z]);
        for (i = 0; i < orders.length; i++) {
            if (snake[i + 1] != undefined) {
                if (orders[i].length > 0) {

                    order = orders[i].pop();
                    var dist = calculateDistance(snake[i+1].position, order);
                    //console.log(dist);
                    if (dist >= 1) {
                        //console.log(snake[i + 1]);
                        if (i < orders.length - 1) {
                            orders[i + 1].push([snake[i + 1].position.x, snake[i + 1].position.y, snake[i + 1].position.z]);
                        }
                        snake[i + 1].position.x = order[0];
                        snake[i + 1].position.y = order[1];
                        snake[i + 1].position.z = order[2];

                    }
                }


            }
        }
        //orders = new_orders;

    }
;
function calculateDistance(position, order) {
    return Math.sqrt(Math.pow(position.x-order[0], 2)+ Math.pow(position.y-order[1], 2) + Math.pow(position.z-order[2], 2));
}

animate();