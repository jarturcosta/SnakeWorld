FOODTYPES = ["Apple", "rat", "bird"];
OBJECT_TEXTURES = ["apple", "rat", "bird"];
meshes = [];
game = function (scene) {
    this.food = {};
    this.obstacles = {};
    this.scene = scene;
    this.meshes = [];
    this.loaded = false;
    this.init = function init(objects) {
        console.log(objects);
        this.spawnableObjects = objects;
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
        } else if (random_type < 21) {
            type = "Bird";
        } else {
            type = "Apple";
        }
        this.spawn(type, position);
    }
    this.collision = function collision(origin) {
        var temp = [];
        for (i = 0; i < meshes.length; i++) {
            temp.push(meshes[i]);
        }
        for (i = 0; i < temp.length; i++) {
            if (distance(origin.position, temp[i].position) < 2) {
                scene.remove(temp[i]);
                meshes.splice(i, 1);
                this.spawnFood();
            }
        }

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

function clone(obj) {
    if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
        return obj;

    if (obj instanceof Date)
        var temp = new obj.constructor(); //or new Date(obj);
    else
        var temp = obj.constructor();

    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj['isActiveClone'] = null;
            temp[key] = clone(obj[key]);
            delete obj['isActiveClone'];
        }
    }
    return temp;
}