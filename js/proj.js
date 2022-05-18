/*global THREE*/

//cameras, scene and renderer + geometry, material and mesh for objects
var camera, camera1, camera2, camera3, scene, renderer;
var geometry, material, mesh;

//stationary objects on the scene
var ball, plane, tube, cube, pyramid;

//articulate objects on the scene + pivot
var mainTorus, secondTorus, sphere, pivot;

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
    //pos main: 10, -4, 6
    //pos second: 0, 0, 8
    //pos sphere: 0, 19, 0 (Estas posições podem não funcionar, mas já se ve)
    'use strict';

    material = new THREE.MeshPhysicalMaterial({ color: '#cacaff' });
    geometry = new THREE.TorusGeometry(mainTorusRadius, mainTorusTubeRadius, 16, 50);
    mainTorus = new THREE.Mesh(geometry, material);

    var texture = new THREE.Texture();
	texture.image = image;
	image.onload = function() {
	    texture.needsUpdate = true;
	};
    material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
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
    scene.add(mainTorus);
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
        mainTorus.translateX(1.0);

    if (moveXNegative)
        mainTorus.translateX(-1.0);

    if (moveYPositive)
        mainTorus.translateY(1.0);

    if (moveYNegative)
        mainTorus.translateY(-1.0);

    if (moveZPositive)
        mainTorus.translateZ(1.0);

    if (moveZNegative)
        mainTorus.translateZ(-1.0);

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
	image.src = 'data:image/jpeg;base64,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';
}