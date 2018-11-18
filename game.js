FOODTYPES = ["Apple", "rat", "bird"];
OBJECT_TEXTURES = ["apple", "rat", "bird"];
HARMFUL_OBJECTS = [];
meshes = [];
texture_snake = new THREE.TextureLoader().load('assets/snek.jpg');
geometry_snake = new THREE.SphereGeometry(5, 32, 32);
material_snake = new THREE.MeshBasicMaterial({map: texture_snake});


game = function (scene, snake, orders) {
    this.snake = snake;
    this.orders = orders;
    this.score = 1;
    this.food = {};
    this.obstacles = {};
    this.scene = scene;
    this.meshes = [];
    this.loaded = false;
    this.init = function init(objects) {
        console.log(objects);
        this.spawnableObjects = objects;
        ambient_light = new THREE.AmbientLight(0x404040, 2); // soft white light
        ambient_light.position.set(5, 10, 5);
        ambient_light.name = "ambient";
        this.scene.add(ambient_light);
    }

    function randomPosition(x, y) {
        return new Position(getRandomInt(x), 0, getRandomInt(y));
    }

    this.checkFood = function () {
        if (this.spawnableObjects != undefined && meshes.length < 5) {
            this.spawnFood();
        }
    }
    this.spawn = function (type, position) {
        //console.log(spawnableObjects);
        if (this.spawnableObjects != undefined && this.spawnableObjects[type] != undefined) {
            var mesh = this.spawnableObjects[type].clone();
            mesh.objectType = type;
            mesh.position.x = position.x;
            mesh.position.y = position.y;
            mesh.position.z = position.z;
            meshes.push(mesh);
            this.scene.add(mesh);
        }
    }
    this.spawnFood = function spawnFood() {
        var position = randomPosition([0, 50], [0, 50]);

        var random_type = getRandomInt([0, 100]);
        var type;
        if (random_type == 1) {
            type = "GoldenMouse";
        } else if (random_type < 42 && random_type > 22) {
            console.log("Shroom");
            type = "mushroom";
        } else if (random_type < 21) {
            type = "Bird";
        } else {
            type = "Apple";
        }
        this.spawn(type, position);
    }
    this.head_collision = function collision(origin) {
        var temp = [];
        for (i = 0; i < meshes.length; i++) {
            temp.push(meshes[i]);
        }
        for (i = 0; i < temp.length; i++) {
            if (distance(origin.position, temp[i].position) < 2) {
                scene.remove(temp[i]);
                meshes.splice(i, 1);
                this.spawnFood();
                return this.collide(temp[i]);

            }
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
                return 2;
                break;
            case "GoldenMouse":
                return 5;
                break;
            case "mushroom":
                this.mushroom_effect(25);
                break;
        }
    }

    this.mushroom_effect = async function mushroom_effect(cicles) {
        var i;
        var j;
        var colors = [0x005bef,0xc300ef,0xef0000,0x00ef33,0xefcb00];
        for (i = 0; i < cicles;i++) {
            for (j = 0; j < colors.length; j++) {
                this.scene.background = new THREE.Color(colors[j]);
                scene.getObjectByName("ambient",true).color = new THREE.Color(colors[j]);
                scene.getObjectByName("ambient",true).intensity = 1;
                await this.sleep(30);
            }
        }
        this.scene.background = new THREE.Color(0x00CCFF);
        scene.getObjectByName("ambient",true).color = new THREE.Color(0x404040)
        scene.getObjectByName("ambient",true).intensity = 2;

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

