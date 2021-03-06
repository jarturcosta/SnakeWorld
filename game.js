FOODTYPES = ["Apple", "rat", "bird"];
OBJECT_TEXTURES = ["apple", "rat", "bird"];
HARMFUL_OBJECTS = [];
meshes = [];
texture_snake = new THREE.TextureLoader().load('assets/snek3.jpg');
geometry_snake = new THREE.SphereGeometry(5, 32, 32);
material_snake = new THREE.MeshBasicMaterial({map: texture_snake});
ambient_light = new THREE.AmbientLight(0x404040, 2); // soft white light
ambient_light.position.set(5, 10, 5);
ambient_light.name = "ambient";

game = function (scene, snake, orders, controls, size) {
    this.snake = snake;
    this.size = size;
    this.enemies = [];
    this.spawnedFood = 0;
    this.enemyLimit = 1;
    this.enemy = undefined;
    this.orders = orders;
    this.score = 1;
    this.food = {};
    this.obstacles = {};
    this.scene = scene;
    this.scene.add(ambient_light);
    this.meshes = [];
    this.loaded = false;
    this.controls = controls;
    this.init = function init(objects) {
        this.spawnableObjects = objects;
    }

    function randomPosition(x, y) {
        return new Position(getRandomInt(x), 0, getRandomInt(y));
    }

    this.checkFood = function () {
        if (this.spawnableObjects != undefined && this.spawnedFood < 25) {
            this.spawnedFood += 1;
            this.spawnFood();
        }
    }
    this.spawn = function (type, position) {
        if (this.spawnableObjects != undefined && this.spawnableObjects[type] != undefined) {
            var mesh = this.spawnableObjects[type].clone();
            mesh.objectType = type;
            mesh.position.x = position.x;
            mesh.position.y = position.y;
            if (type == "Bird") {
                mesh.position.y = getRandomInt([50, 65]);
            }
            mesh.position.z = position.z;
            meshes.push(mesh);
            this.scene.add(mesh);
        }
    }
    this.spawnTrees = function spawnTrees() {
        if (meshes.length < 75)
            for (var i = 0; i < 50; i++) {
                var r = getRandomInt([1, 4]);
                this.spawn("tree" + r, randomPosition([-this.size + 5, this.size - 5], [-this.size + 5, this.size - 5]));
            }

    }
    this.spawnFood = function spawnFood() {
        var position = randomPosition([-this.size + 5, this.size - 5], [-this.size + 5, this.size - 5]);

        var random_type = getRandomInt([0, 99]);
        var type;
        if (random_type == 0) {
            type = "GoldenMouse";
        } else if (random_type > 0 && random_type <= 5) {
            type = "mushroom";
        } else if (random_type > 5 && random_type <= 7) {
            type = "bomb";
        } else if (random_type > 7 && random_type <= 10) {
            type = "cactus";
        } else if (random_type > 10 && random_type <= 20) {
            type = "Bird";
        } else {
            type = "Apple";
        }
        this.spawn(type, position);
    }

    this.enemiesCheck = function enemiesCheck() {
        this.enemiesMovement();
    }
    this.spawnEnemy = function spawnEnemy() {
        var position = randomPosition([-this.size + 5, this.size-5], [-this.size + 5, this.size-5]);
        if (this.spawnableObjects != undefined && this.spawnableObjects["pacman"] != undefined) {
            var mesh = this.spawnableObjects["pacman"].clone();
            mesh.objectType = "pacman";
            mesh.position.x = position.x;
            mesh.position.y = position.y;
            mesh.position.z = position.z;
            console.log(mesh);
            this.enemies.push(mesh);

            this.scene.add(mesh);
        }
    }
    this.enemiesMovement = function enemiesMovement() {
        for (var i = 0; i < this.enemies.length; i++) {
            var angle = this.snake[0].rotation.y;
            this.enemies[i].position.x -= Math.cos(angle);
            this.enemies[i].position.z -= Math.sin(angle);
            //console.log(this.enemies[i].position);
        }
    }
    this.head_collision = function collision(origin) {
        var temp = [];
        for (i = 0; i < meshes.length; i++) {
            temp.push(meshes[i]);
        }
        for (i = 0; i < temp.length; i++) {
            if (distance(origin.position, temp[i].position) < 1) {
                scene.remove(temp[i]);
                meshes.splice(i, 1);
                var points = this.collide(temp[i])
                this.score += points;
                this.spawnedFood -= 1;
                return points;

            }
        }
        for (i = 0; i < 21; i++) {

        }
        return 0;

    }
    this.snake_collision = function snake_collision() {
        var temp = [];
        for (i = 0; i < meshes.length; i++) {
            temp.push(meshes[i]);
        }
        temp.push(snake[0]);
        for (i = 4; i < this.snake.length; i++) {

            for (j = 0; j < temp.length; j++) {
                if (distance(snake[i].position, temp[j].position) < 1 && temp[j].objectType == "Snake") {
                    return i;

                }
            }
        }
        return -1;
    }
    this.collide = function collide(mesh) {
        switch (mesh.objectType) {
            case "Apple":
                return 1;
                break;
            case "Bird":
                return 10;
                break;
            case "GoldenMouse":
                return 5;
                break;
            case "mushroom":
                this.mushroom_effect(50);
                break;
            case "cactus":
                this.cactus_effect(50);
                break;
            case "bomb":
                return -3;
                break;
            case "rock":
                return -1;
                break;
            case "tree1":
                return -2;
                break;
            case "tree2":
                return -2;
                break;
            case "tree3":
                return -2;
                break;
            case "tree4":
                return -2;
                break;
        }
        return 0;
    }

    this.mushroom_effect = async function mushroom_effect(cicles) {
        this.controls.multiplier = this.controls.multiplier * 2;
        var i;
        var j;
        var colors = [0x005bef, 0xc300ef, 0xef0000, 0x00ef33, 0xefcb00];
        for (i = 0; i < cicles; i++) {
            for (j = 0; j < colors.length; j++) {
                this.scene.background = new THREE.Color(colors[j]);
                scene.getObjectByName("ambient", true).color = new THREE.Color(colors[j]);
                scene.getObjectByName("ambient", true).intensity = 1;
                await this.sleep(30);
            }
        }
        this.scene.background = new THREE.Color(0x00CCFF);
        scene.getObjectByName("ambient", true).color = new THREE.Color(0x404040)
        scene.getObjectByName("ambient", true).intensity = 2;
        this.controls.multiplier = this.controls.multiplier / 2;

    }

    this.cactus_effect = async function cactus_effect(cicles) {
        this.controls.multiplier = this.controls.multiplier/ 2;
        var i;
        for (i = 0; i < cicles*5; i++) {
            await this.sleep(30);
        }
        this.controls.multiplier = this.controls.multiplier * 2;

    }

    this.sleep = function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}

class Position {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

}

function getRandomInt(range) {
    range[0] = Math.ceil(range[0]);
    range[1] = Math.floor(range[1]);
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}

function distance(position1, position2) {
    return Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2) + Math.pow(position1.z - position2.z, 2));
}

function vector(p1, p2) {
    return {x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z}
}
