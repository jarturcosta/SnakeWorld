var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.z = 5;
camera.position.y -= 19;
spawnableObjects = {};
//camera.position.z =150;


var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color(0x00CCFF);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

var cubePosition;
var cubeSize;
var moveSpeed = 0.2;
var turnSpeed = 0.1;


var material = new THREE.MeshBasicMaterial({map: texture});
var texture_sky = new THREE.TextureLoader().load('assets/snek3.jpg');
texture_sky.rotation += Math.Pi / 2;
var geometry = new THREE.SphereGeometry(5, 32, 32);
var material = new THREE.MeshBasicMaterial({map: texture_sky});

var i;
var snake = [];
var orders = [];


for (i = 1; i < 5; i++) {
    var temp = new THREE.Mesh(geometry, material);
    temp.position.y = 0.4;
    /*temp.scale.x= 0.25;
    temp.scale.y= 0.25;
    temp.scale.z= 0.25;*/
    // temp.position.z += i;
    temp.receiveShadow = true;
    temp.castShadow = true;
    temp.scale.set(0.1, 0.1, 0.1);
    temp.objectType = "Snake";
    temp.position.x -= i;
    scene.add(temp);
    snake.push(temp);
    orders.push([]);
}


var geometry_plane = new THREE.PlaneGeometry(320, 320, 32);
var texture = new THREE.TextureLoader().load('assets/372313222_2048x2048_6195987693227547908.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(16, 16);
var material = new THREE.MeshBasicMaterial({map: texture});
var plane = new THREE.Mesh(geometry_plane, material);
plane.rotation.x = -(Math.PI / 2);
scene.add(plane);

var geometry_wall = new THREE.PlaneGeometry(200, 40, 32);
var texture = new THREE.TextureLoader().load('assets/wall2.jpg');
var material = new THREE.MeshBasicMaterial({map: texture});

var wall1 = new THREE.Mesh(geometry_wall, material);
wall1.position.z = -100;
scene.add(wall1);

var wall2 = new THREE.Mesh(geometry_wall, material);
wall2.position.x = -100;
wall2.rotation.y = -(Math.PI / 2);
wall2.material.side = THREE.DoubleSide;
scene.add(wall2);

var wall3 = new THREE.Mesh(geometry_wall, material);
wall3.position.x = 100;
wall3.rotation.y = -(Math.PI / 2);
wall3.material.side = THREE.DoubleSide;
scene.add(wall3);

var wall4 = new THREE.Mesh(geometry_wall, material);
wall4.position.z = 100;
wall4.material.side = THREE.DoubleSide;
scene.add(wall4);

//add_model("tree1",0.15,30,28);

/*
var mtlLoader = new THREE.MTLLoader();
mtlLoader.setTexturePath('assets/');
mtlLoader.setPath('assets/');
mtlLoader.load('dungeon3.mtl', function (materials) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('assets/');
    objLoader.load('dungeon3.obj', function (object) {


        object.scale.x = 0.015;
        object.scale.y = 0.015;
        object.scale.z = 0.015;
        object.rotation.x = -(Math.PI / 2);
        object.position.z = -10;
        scene.add(object);


        //object.position.y -= 60;

    });

});
*/

//scene.add( body );
controls = new THREE.PlayerControls(camera, snake[0], snake);
controls.init();
game = new game(scene, snake, orders, controls, 100);

var p = newObject("Apple", 0.008);
p.then(function (response) {
    game.init(spawnableObjects);
}, function (err) {
    console.log(err);
});
p = newObject("Bird", 0.04);
p.then(function (response) {
    game.init(spawnableObjects);
}, function (err) {
    console.log(err);
});
p = newObject("GoldenMouse", 0.005);
p.then(function (response) {
    game.init(spawnableObjects);
    console.log(spawnableObjects);
}, function (err) {
    console.log(err);
});
p = newObject("mushroom", 0.015);
p.then(function (response) {
    game.init(spawnableObjects);
}, function (err) {
    console.log(err);
});
p = newObject("cactus", 0.015);
p.then(function (response) {
    game.init(spawnableObjects);
}, function (err) {
    console.log(err);
});
p = newObject("bomb", 0.005);
p.then(function (response) {
    game.init(spawnableObjects);
}, function (err) {
    console.log(err);
});

p = newObject("pacman", 0.015);
p.then(function (response) {
    game.init(spawnableObjects);
}, function (err) {
    console.log(err);
});

var i;
for (i = 1; i <= 4; i++) {
    var p = newObject("tree" + i, 0.1);
    p.then(function (response) {
        game.init(spawnableObjects);
    }, function (err) {
        console.log(err);
    });
}

game.spawnTrees();
var animate = function () {
        controls.moveSpeed = 0.08 + 0.01*(snake.length-4);
        document.getElementById("score").innerHTML = snake.length - 4;
        game.spawnTrees();
        var f = game.head_collision(snake[0]);
        var c = game.snake_collision();
        //console.log(h);
        game.checkFood();
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
                    var dist = calculateDistance(snake[i + 1].position, order);
                    //console.log(dist);
                    if (dist >= 0.5) {
                        //console.log(snake[i + 1]);
                        if (i < orders.length - 1) {
                            orders[i + 1] = [];
                            orders[i + 1].push([snake[i + 1].position.x, snake[i + 1].position.y, snake[i + 1].position.z]);
                        }
                        snake[i + 1].position.x = order[0];
                        snake[i + 1].position.y = order[1];
                        snake[i + 1].position.z = order[2];

                    }
                }


            }
        }
        //console.log(orders);
        switch (f) {
            case -1:
                reduceSnake(snake.length - 1);
                break;
            case -2:
                if (snake.length >= 8)
                    reduceSnake(parseInt(snake.length / 2));
                else
                    reduceSnake(4);
                break;
            case -3:
                reduceSnake(4);
            default:
                expandSnake(f);
        }
        reduceSnake(c);
        //orders = new_orders;

    }
;

function calculateDistance(position, order) {
    return Math.sqrt(Math.pow(position.x - order[0], 2) + Math.pow(position.y - order[1], 2) + Math.pow(position.z - order[2], 2));
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function newObject(name, scale) {
    var loaderPromise = new Promise(function (resolve, reject) {
        function loadDone(x) {
            x.scale.set(scale, scale, scale);
            x.rotation.x -= Math.PI / 2;
            spawnableObjects[name] = x;
            resolve(x); // it went ok!
        }

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setTexturePath('assets/');
        mtlLoader.setPath('assets/');
        mtlLoader.load(name + '.mtl', function (materials) {

            materials.preload();

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('assets/');
            objLoader.load(name + '.obj', loadDone);

        });
    });
    return loaderPromise;

}

function expandSnake(i) {
    for (j = 0; j < i; j++) {
        var temp = snake[snake.length - 1].clone();
        temp.scale.set(0.1, 0.1, 0.1);
        scene.add(temp);
        snake.push(temp);
        orders.push([]);
    }
}

function reduceSnake(i) {
    if (i != -1) {
        console.log(i + "cortar a cobra");
        for (j = i; j < snake.length; j++) {
            var temp = snake[snake.length - 1].clone();
            scene.remove(snake[j]);
        }
        snake.splice(i, snake.length - i);
        orders.splice(i, orders.length - i);
    }
}


animate();