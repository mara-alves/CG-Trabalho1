/*global THREE*/

//cameras, scene and renderer + geometry, material and mesh for objects
var camera, camera1, camera2, camera3, scene, renderer;
var geometry, material, mesh;

//stationary objects on the scene
var ball, plane, tube, cube, pyramid;

//articulate objects on the scene + pivot
var mainBody, mainTorus, secondTorus, sphere, pivot;

var clock = new THREE.Clock();
var delta;

//rotation booleans
//RMP - Q, RMN - W, R2P - A, R2N - S, RSP - Z, RSN - X 
var rotMainPositive = false,
    rotSecondPositive = false,
    rotSpherePositive = false,
    rotMainNegative = false,
    rotSecondNegative = false,
    rotSphereNegative = false;

//translation booleans
//X+: ->, X-: <-, Y+: up, Y-: down, Z+: C, Z-: D
var moveXPositive = false,
    moveXNegative = false,
    moveYPositive = false,
    moveYNegative = false,
    moveZPositive = false,
    moveZNegative = false;

//articulate objects measurements
var mainTorusRadius = 10,
    mainTorusTubeRadius = 2,
    secondTorusRadius = 8,
    secondTorusTubeRadius = mainTorusTubeRadius,
    sphereRadius = 2;

var viewSize = 1100,
    originalAspect;

//renders scene
function render() {
    'use strict';
    delta = clock.getDelta();
    renderer.render(scene, camera);
}

//create sphere
function addSphere(obj, x, y, z, r, ws, hs, c) {
    'use strict';
    geometry = new THREE.SphereGeometry(r, ws, hs);
    material = new THREE.MeshPhysicalMaterial({ color: c, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    obj.add(mesh);
}

//create cylinder
function addCylinder(obj, x, y, z, rt, rb, h, rs, rot, c) {
    'use strict';
    geometry = new THREE.CylinderGeometry(rt, rt, h, rs);
    geometry.rotateX(rot);
    material = new THREE.MeshBasicMaterial({ color: c, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    obj.add(mesh);
}

//create torus
function addTorus(obj, x, y, z, r, t, rs, ts, rotX, rotZ, c) {
    'use strict';
    geometry = new THREE.TorusGeometry(r, t, rs, ts);
    geometry.rotateX(rotX);
    geometry.rotateZ(rotZ);
    material = new THREE.MeshPhysicalMaterial({ color: c, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    obj.add(mesh);
}

//create pyramid
function addPyramid(obj, x, y, z, r, rs, hs, c) {
    'use strict';
    geometry = new THREE.ConeGeometry(r, rs, hs);
    material = new THREE.MeshPhysicalMaterial({ color: c, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    obj.add(mesh);
}

//create Planet
function createPlanet(x, y, z) {
    'use strict';
    var ball = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xcacaff, wireframe: false });

    addSphere(ball, 0, 0, 0, 6, 10, 10, 0xcacaff);
    addTorus(ball, 0, 0, 0, 11, 0.5, 16, 100, 1.30, 0, 0xffffff);

    scene.add(ball);

    ball.position.x = x;
    ball.position.y = y;
    ball.position.z = z;
}

//create Fish
function createFish(x, y, z) {
    'use strict';
    var fish = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xcacaff, wireframe: false });

    addSphere(fish, 5, 0, 5, 1, 10, 10, 0x6495ED);
    addPyramid(fish, 0, 0, 0, 13, 21, 3, 0xffff00);
    addPyramid(fish, 0, 0, -10, 8, 15, 3, 0xcacaff);

    scene.add(fish);

    fish.position.x = x;
    fish.position.y = y;
    fish.position.z = z;
}

//creates articulate object
function createFigure(x, y, z) {
    'use strict';

    mainBody = new THREE.Object3D();

    material = new THREE.MeshPhysicalMaterial({ color: '#cacaff' });
    geometry = new THREE.TorusGeometry(mainTorusRadius, mainTorusTubeRadius, 16, 50);
    mainTorus = new THREE.Mesh(geometry, material);

    var texture = new THREE.Texture();
    texture.image = image;
    image.onload = function() {
        texture.needsUpdate = true;
    };
    material = new THREE.MeshBasicMaterial({ map: texture, color: '#ffffff' });
    geometry = new THREE.TorusGeometry(secondTorusRadius, secondTorusTubeRadius, 16, 50);
    secondTorus = new THREE.Mesh(geometry, material);
    secondTorus.rotateY(Math.PI / 2);

    material = new THREE.MeshPhysicalMaterial({ color: '#4B0082' });
    geometry = new THREE.SphereGeometry(sphereRadius, 32, 16);
    sphere = new THREE.Mesh(geometry, material);

    pivot = new THREE.Group();

    sphere.position.set(0, secondTorusTubeRadius + sphereRadius, 0);
    pivot.position.set(0, secondTorusRadius, 0); //5 + 4 + 4
    secondTorus.position.set(0, mainTorusRadius, 0);
    mainTorus.position.set(x, y, z);

    pivot.add(sphere);
    secondTorus.add(pivot);
    mainTorus.add(secondTorus);
    mainBody.add(mainTorus);
    scene.add(mainBody);
}

function createCylinders(x, y, z) {
    'use strict';
    var cyl = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0xcacaff, wireframe: false });

    addCylinder(cyl, -13, -10, 0, 0.2, 0.2, 35, 64, 2.7, 0xcacaff);
    addCylinder(cyl, 0, 0, 0, 0.2, 0.2, 35, 64, 3, 0xffff00);
    addCylinder(cyl, 5, 5, -4, 0.2, 0.2, 35, 64, 3.2, 0x6495ED);

    scene.add(cyl);

    cyl.position.x = x;
    cyl.position.y = y;
    cyl.position.z = z;
}

function createPlane(x, y, z) {
    'use strict';
    plane = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xcacaff, wireframe: false, side: THREE.DoubleSide });
    geometry = new THREE.PlaneGeometry(15, 40);
    geometry.rotateX(-0.79);
    mesh = new THREE.Mesh(geometry, material);

    plane.add(mesh);
    plane.position.set(x, y, z);

    scene.add(plane);
}

function createTube(x, y, z) {
    'use strict';
    tube = new THREE.Object3D();
    class CustomSinCurve extends THREE.Curve {

        constructor(scale = 1) {

            super();

            this.scale = scale;

        }

        getPoint(t, optionalTarget = new THREE.Vector3()) {

            const tx = t * 3 - 1.5;
            const ty = Math.sin(2 * Math.PI * t);
            const tz = 0;

            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);

        }
    }

    const path = new CustomSinCurve(10);
    const geometry = new THREE.TubeGeometry(path, 20, 2, 8, false);
    const material = new THREE.MeshPhysicalMaterial({ color: '#CA8', wireframe: false });
    const mesh = new THREE.Mesh(geometry, material);

    tube.add(mesh);
    tube.position.set(x, y, z);
    scene.add(tube);
}

function createCube(x, y, z, c) {
    'use strict';
    cube = new THREE.Object3D();

    material = new THREE.MeshPhysicalMaterial({ color: c, wireframe: false });
    geometry = new THREE.BoxGeometry(5, 5, 5);
    geometry.rotateX(-0.79);
    mesh = new THREE.Mesh(geometry, material);

    cube.add(mesh);
    cube.position.set(x, y, z);

    scene.add(cube);
}

function createPyramid(x, y, z) {
    'use strict';
    pyramid = new THREE.Object3D();

    geometry = new THREE.ConeGeometry(5, 13, 4);
    geometry.rotateX(0.5);
    material = new THREE.MeshBasicMaterial({ color: 0xDDA0DD, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);

    pyramid.add(mesh);
    pyramid.position.set(x, y, z);
    scene.add(pyramid);
}

function createDodecahedron(x, y, z, r, c) {
    'use strict';
    var dode = new THREE.Object3D();

    geometry = new THREE.DodecahedronGeometry(r, 0);
    material = new THREE.MeshPhysicalMaterial({ color: c, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);

    dode.add(mesh);
    dode.position.set(x, y, z);
    scene.add(dode);
}

function createCameras() {
    'use strict';

    originalAspect = window.innerWidth / window.innerHeight;

    camera1 = new THREE.OrthographicCamera(viewSize * originalAspect / -15, viewSize * originalAspect / 15, viewSize / 15, viewSize / -15, 1, 1000);
    camera1.position.x = 50;
    camera1.position.y = 50;
    camera1.position.z = 50;
    camera1.lookAt(scene.position);

    camera = camera1;

    camera2 = new THREE.OrthographicCamera(viewSize * originalAspect / -15, viewSize * originalAspect / 15, viewSize / 15, viewSize / -15, 1, 1000);
    camera2.position.x = 0;
    camera2.position.y = 100;
    camera2.position.z = 0;
    camera2.lookAt(scene.position);

    camera3 = new THREE.OrthographicCamera(viewSize * originalAspect / -15, viewSize * originalAspect / 15, viewSize / 15, viewSize / -15, 1, 1000);
    camera3.position.x = 0;
    camera3.position.y = 0;
    camera3.position.z = 100;
    camera3.lookAt(scene.position);
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.add(new THREE.AxisHelper(10));

    createPlanet(-30, 30, 30);
    createFish(10, -10, -10);
    createPlane(0, 0, 0);
    createTube(-10, 0, -50);
    createCube(-10, -20, 25, 0xFFFFE0);
    createCube(-20, -15, 15, 0x7FFFD4);
    createCube(-15, -25, 13, 0x98FB98);
    createPyramid(-10, 20, 10);
    createFigure(-30, -40, 40);
    createDodecahedron(15, -40, -15, 6, 0xDDA0DD);
    createDodecahedron(25, -35, -25, 3, 0x87CEEB);
    createCylinders(12, -30, 20);

    const light = new THREE.HemisphereLight(0xd44bff, 0xffa52d, 1);
    const light2 = new THREE.AmbientLight(0xffffff, 1);
    const light3 = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(light);
    scene.add(light2);
    scene.add(light3);
}

function onResize() {
    'use strict';

    var aspect = window.innerWidth / window.innerHeight;
    var change = originalAspect / aspect;
    var newSize = viewSize * change;

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera1.left = aspect * newSize / -15;
        camera1.right = aspect * newSize / 15;
        camera1.top = newSize / 15;
        camera1.bottom = newSize / -15;
        camera1.updateProjectionMatrix();

        camera2.left = aspect * newSize / -15;
        camera2.right = aspect * newSize / 15;
        camera2.top = newSize / 15;
        camera2.bottom = newSize / -15;
        camera2.updateProjectionMatrix();

        camera3.left = aspect * newSize / -15;
        camera3.right = aspect * newSize / 15;
        camera3.top = newSize / 15;
        camera3.bottom = newSize / -15;
        camera3.updateProjectionMatrix();
    }
}

function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
        case 49: //1
            camera = camera1;
            break;
        case 50: //2
            camera = camera2;
            break;
        case 51: //3
            camera = camera3;
            break;
        case 52: //4
            scene.traverse(function(node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            break;

            // =-=-=| Rotations |=-=-=
        case 81: //Q
        case 113: //q
            rotMainPositive = true;
            break;

        case 87: //W
        case 119: //w
            rotMainNegative = true;
            break;

        case 65: //A
        case 97: //a
            rotSecondPositive = true;
            break;

        case 83: //S
        case 115: //s
            rotSecondNegative = true
            break;

        case 90: //Z
        case 122: //z
            rotSpherePositive = true;
            break;

        case 88: //X
        case 120: //x
            rotSphereNegative = true;
            break;

            // =-=-=| Translations |=-=-=
        case 37: //left arrow
            moveXNegative = true;
            break;

        case 39: //right arrow
            moveXPositive = true;
            break;

        case 38: //up arrow
            moveYPositive = true;
            break;

        case 40: //down arrow
            moveYNegative = true;
            break;

        case 68: //D
        case 100: //d
            moveZNegative = true;
            break;

        case 67: //C
        case 99: //c
            moveZPositive = true;
            break;
    }
}

function onKeyUp(e) {
    'use strict';

    switch (e.keyCode) {
        // =-=-=| Rotations |=-=-=
        case 81: //Q
        case 113: //q
            rotMainPositive = false;
            break;

        case 87: //W
        case 119: //w
            rotMainNegative = false;
            break;

        case 65: //A
        case 97: //a
            rotSecondPositive = false;
            break;

        case 83: //S
        case 115: //s
            rotSecondNegative = false;
            break;

        case 90: //Z
        case 122: //z
            rotSpherePositive = false;
            break;

        case 88: //X
        case 120: //x
            rotSphereNegative = false;
            break;

            // =-=-=| Translations |=-=-=

        case 37: //left arrow
            moveXNegative = false;
            break;

        case 39: //right arrow
            moveXPositive = false;
            break;

        case 38: //up arrow
            moveYPositive = false;
            break;

        case 40: //down arrow
            moveYNegative = false;
            break;

        case 68: //D
        case 100: //d
            moveZNegative = false;
            break;

        case 67: //C
        case 99: //c
            moveZPositive = false;
            break;
    }
}

function animate() {
    'use strict';

    var translateVector = new THREE.Vector3(0, 0, 0);

    var movement = 50;

    if (rotMainPositive)
        mainTorus.rotateY(0.02);

    if (rotMainNegative)
        mainTorus.rotateY(-0.02);

    if (rotSecondPositive)
        secondTorus.rotateZ(0.01);

    if (rotSecondNegative)
        secondTorus.rotateZ(-0.01);

    if (rotSpherePositive)
        pivot.rotation.x += 0.02;

    if (rotSphereNegative)
        pivot.rotation.x -= 0.02;

    if (moveXPositive)
        translateVector.x += movement;

    if (moveXNegative)
        translateVector.x -= movement;

    if (moveYPositive)
        translateVector.y += movement;

    if (moveYNegative)
        translateVector.y -= movement;

    if (moveZPositive)
        translateVector.z += movement;

    if (moveZNegative)
        translateVector.z -= movement;

    console.log(delta);

    mainBody.translateX(translateVector.x * delta);
    mainBody.translateY(translateVector.y * delta);
    mainBody.translateZ(translateVector.z * delta);

    requestAnimationFrame(animate);
    render();
}

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    loadTexture();

    createScene();
    createCameras();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}


function loadTexture() {
    image = new Image();
    image.src = 'data:image/png;base64,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7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6ic/n7/qJz+fv+onP5+/6vwMAieUGN9PxHCUAAAAASUVORK5CYII=';
}