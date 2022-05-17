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
var rotMainPositive = false, rotSecondPositive = false, rotSpherePositive = false, rotMainNegative = false, rotSecondNegative = false, rotSphereNegative = false;

//translation booleans

//articulate objects measurements
var mainTorusRadius = 10, mainTorusTubeRadius = 2, secondTorusRadius = 8, secondTorusTubeRadius = mainTorusTubeRadius, sphereRadius = 2;

//renders scene
function render(){
	'use strict';
	renderer.render(scene, camera);
}

//create sphere
function addSphere(obj, x, y, z, r, ws, hs, c) {
	'use strict';
	geometry = new THREE.SphereGeometry(r, ws, hs);
	material = new THREE.MeshPhysicalMaterial( {color: c,  wireframe: false} );
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);

	obj.add(mesh);
}

//create cylinder
function addCylinder(obj, x, y, z, rt, rb, h, rs, rot, c) {
	'use strict';
	geometry = new THREE.CylinderGeometry( rt, rt, h, rs);
	geometry.rotateX(rot);
	material = new THREE.MeshBasicMaterial( {color: c,  wireframe: false} );
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);

	obj.add(mesh);
}

//create torus
function addTorus(obj, x, y, z, r, t, rs, ts, rotX, rotZ, c) {
	'use strict';
	geometry = new THREE.TorusGeometry( r, t, rs, ts);
	geometry.rotateX(rotX);
	geometry.rotateZ(rotZ);
	material = new THREE.MeshPhysicalMaterial( {color: c,  wireframe: false} );
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);

	obj.add(mesh);
}

//create pyramid
function addPyramid(obj, x, y, z, r, rs, hs, c) {
	'use strict';
	geometry = new THREE.ConeGeometry( r, rs, hs);
	material = new THREE.MeshPhysicalMaterial( {color: c,  wireframe: false} );
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
	addTorus(ball, 0, 0, 0, 11, 0.5, 16, 100, 1.30, 0xff);

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
function createFigure(x, y, z){
	//pos main: 10, -4, 6
	//pos second: 0, 0, 8
	//pos sphere: 0, 19, 0 (Estas posições podem não funcionar, mas já se ve)
	'use strict';
    
    material = new THREE.MeshPhysicalMaterial({ color: '#cacaff'});
    geometry = new THREE.TorusGeometry(mainTorusRadius, mainTorusTubeRadius, 16, 50);
    mainTorus = new THREE.Mesh(geometry, material);
    
    material = new THREE.MeshPhysicalMaterial({ color: '#ffff00'});
    geometry = new THREE.TorusGeometry(secondTorusRadius, secondTorusTubeRadius, 16, 50);
    secondTorus = new THREE.Mesh(geometry, material);
    secondTorus.rotateY(Math.PI/2);
    
    material = new THREE.MeshPhysicalMaterial({ color: '#4B0082'});
    geometry = new THREE.SphereGeometry(sphereRadius, 32, 16);
    sphere = new THREE.Mesh(geometry, material);
    
    pivot = new THREE.Group();

    sphere.position.set(0, secondTorusTubeRadius + sphereRadius, 0);
    pivot.position.set(0, secondTorusRadius, 0); //5 + 4 + 4
    secondTorus.position.set(0, mainTorusRadius, 0);
    mainTorus.position.set(10, 5, 70);
    
    pivot.add(sphere);
    secondTorus.add(pivot);
    mainTorus.add(secondTorus);
    scene.add(mainTorus);
}

function createCylinders(x, y, z){
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

function createPlane(x, y, z){
	'use strict';
	plane = new THREE.Object3D();

	material = new THREE.MeshBasicMaterial({ color: 0xcacaff, wireframe: false , side: THREE.DoubleSide} );
	geometry = new THREE.PlaneGeometry( 15, 40);
	geometry.rotateX(-0.79);
	mesh = new THREE.Mesh(geometry, material);

	plane.add(mesh);
	plane.position.set(x, y, z);

	scene.add(plane);
}

function createTube(x, y, z){
	'use strict';
	tube = new THREE.Object3D();
	class CustomSinCurve extends THREE.Curve {

		constructor( scale = 1 ) {

			super();

			this.scale = scale;

		}

		getPoint( t, optionalTarget = new THREE.Vector3() ) {

			const tx = t * 3 - 1.5;
			const ty = Math.sin( 2 * Math.PI * t );
			const tz = 0;

			return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );

		}
	}

	const path = new CustomSinCurve( 10 );
	const geometry = new THREE.TubeGeometry( path, 20, 2, 8, false );
	const material = new THREE.MeshPhysicalMaterial( { color: '#CA8' , wireframe: false } );
	const mesh = new THREE.Mesh( geometry, material );

	tube.add(mesh);
	tube.position.set(x, y, z);
	scene.add(tube);
}

function createCube(x, y, z, c) {
	'use strict';
	cube = new THREE.Object3D();

	material = new THREE.MeshPhysicalMaterial({ color: c, wireframe: false} );
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

	geometry = new THREE.ConeGeometry( 5, 13, 4);
	geometry.rotateX(0.5);
	material = new THREE.MeshBasicMaterial( {color: 0xDDA0DD,  wireframe: false} );
	mesh = new THREE.Mesh(geometry, material);

	pyramid.add(mesh);
	pyramid.position.set(x, y, z);
	scene.add(pyramid);
}

function createDodecahedron(x, y, z, r, c){
	'use strict';
	var dode = new THREE.Object3D();

	geometry = new THREE.DodecahedronGeometry(r, 0);
	material = new THREE.MeshPhysicalMaterial( {color: c,  wireframe: false} );
	mesh = new THREE.Mesh(geometry, material);

	dode.add(mesh);
	dode.position.set(x, y, z);
	scene.add(dode);
}

function createCameras(){
	'use strict';
	camera1 = new THREE.OrthographicCamera(window.innerWidth / -15, window.innerWidth / 15, window.innerHeight / 15, window.innerHeight / -15, 1, 1000);
	camera1.position.x = 50;
	camera1.position.y = 50;
	camera1.position.z = 50;
	camera1.lookAt(scene.position);
	
	camera = camera1;
	
	camera2 = new THREE.OrthographicCamera(window.innerWidth / -10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / -10, 1, 1000);
	camera2.position.x = 0;
	camera2.position.y = 100;
	camera2.position.z = 0;
	camera2.lookAt(scene.position);
	
	camera3 = new THREE.OrthographicCamera(window.innerWidth / -10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / -10, 1, 1000);
	camera3.position.x = 0;
	camera3.position.y = 0;
	camera3.position.z = 100;
	camera3.lookAt(scene.position);
}

function createScene(){
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

	const light = new THREE.HemisphereLight( 0xd44bff, 0xffa52d, 1 );
	const light2 = new THREE.AmbientLight( 0xffffff, 1 );
	const light3 = new THREE.DirectionalLight( 0xffffff, 0.8 );
	scene.add( light );
	scene.add( light2 );
	scene.add( light3 );
}

function onResize() {
	'use strict';

	renderer.setSize(window.innerWidth, window.innerHeight);

	if(window.innerHeight > 0 && window.innerWidth > 0) {
		camera.aspect = renderer.getSize().width / renderer.getSize().height;
		camera.updateProjectionMatrix();
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
			scene.traverse(function (node) {
				if (node instanceof THREE.Mesh) {
					node.material.wireframe = !node.material.wireframe;
				}
			});
			break;
		
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
	}
}

function onKeyUp(e) {
    'use strict';

    switch(e.keyCode) {
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
    }
}

function animate() {
	'use strict';

	if(rotMainPositive) 
        mainTorus.rotateY(0.02);

	if(rotMainNegative)
		mainTorus.rotateY(-0.02);
    
    if(rotSecondPositive)
        secondTorus.rotateZ(0.01);
	
	if(rotSecondNegative)
		secondTorus.rotateZ(-0.01);
    
    if(rotSpherePositive)
        pivot.rotation.x += 0.02;
	
	if(rotSphereNegative)
		pivot.rotation.x -= 0.02;
    
    requestAnimationFrame(animate);
    render();
}

function init(){
	'use strict';

	renderer = new THREE.WebGLRenderer({alpha: true});

	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	createScene();
	createCameras();
	
	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
}