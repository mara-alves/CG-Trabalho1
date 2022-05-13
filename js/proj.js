var camera, scene, renderer;
var geometry, material, mesh;
var ball, plane, tube, cube, pyramid;

function render(){
	'use strict';
	renderer.render(scene, camera);

}a

function addSphere(obj, x, y, z, r, ws, hs, c) {
	'use strict';
	geometry = new THREE.SphereGeometry(r, ws, hs);
	material = new THREE.MeshBasicMaterial( {color: c,  wireframe: true} );
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);

	obj.add(mesh);
}

function addCylinder(obj, x, y, z) {
	'use strict';
	geometry = new THREE.CylinderGeometry( 1, 1, 17, 64);
	material = new THREE.MeshPhysicalMaterial( {color: 0xffff00,  wireframe: true} );
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);

	obj.add(mesh);
}

function addTorus(obj, x, y, z, r, t, rs, ts, rotX, c) {
	'use strict';
	geometry = new THREE.TorusGeometry( r, t, rs, ts);
	geometry.rotateZ(rotX);
	material = new THREE.MeshPhysicalMaterial( {color: c,  wireframe: true} );
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);

	obj.add(mesh);
}

function createFigure1(x, y, z) {
	'use strict';
	var ball = new THREE.Object3D();
	material = new THREE.MeshPhysicalMaterial({ color: 0xcacaff, wireframe: true });

	addSphere(ball, 0, 0, 0, 6, 10, 10, 0xcacaff);
	addTorus(ball, 0, 0, 0, 11, 0.5, 16, 100, 1.30, 0xff);

	scene.add(ball);

	ball.position.x = x;
	ball.position.y = y;
	ball.position.z = z;
}


function addPyramid(obj, x, y, z, r, rs, hs, c) {
	'use strict';
	geometry = new THREE.ConeGeometry( r, rs, hs);
	material = new THREE.MeshBasicMaterial( {color: c,  wireframe: true} );
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);

	obj.add(mesh);
}


function createFigure2(x, y, z) {
	'use strict';
	var fish = new THREE.Object3D();
	material = new THREE.MeshBasicMaterial({ color: 0xcacaff, wireframe: true });

	addSphere(fish, 20, 25, 30, 1, 10, 10, 0xff);
	addPyramid(fish, 0, 0, 0, 13, 21, 3, 0xffff00);
	addPyramid(fish, 0, 0, -10, 8, 15, 3, 0xcacaff);

	scene.add(fish);

	fish.position.x = x;
	fish.position.y = y;
	fish.position.z = z;
}

function createFigure3(x, y, z){
	'use strict';
	var ring = new THREE.Object3D();
	material = new THREE.MeshBasicMaterial({ color: 0xcacaff, wireframe: true });

	addSphere(ring, 20, 25, 30, 2, 10, 10, 0xff);
	addTorus(ring, 0, 0, 0, 8, 1.5, 16, 100, 2.5, 0xffff00);
	addTorus(ring, 0, 0, -10, 6, 1, 16, 100, 2,  0xcacaff);

	scene.add(ring);

	ring.position.x = x;
	ring.position.y = y;
	ring.position.z = z;
}

function createPlane(x, y, z){
	'use strict';
	plane = new THREE.Object3D();

	material = new THREE.MeshBasicMaterial({ color: 0xcacaff, wireframe: true , side: THREE.DoubleSide} );
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
	const material = new THREE.MeshPhysicalMaterial( { color: 0x00ff00 , wireframe: true} );
	const mesh = new THREE.Mesh( geometry, material );

	tube.add(mesh);
	tube.position.set(x, y, z);
	scene.add(tube);
}

function createCube(x, y, z, c) {
	'use strict';
	cube = new THREE.Object3D();

	material = new THREE.MeshBasicMaterial({ color: c, wireframe: true} );
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
	material = new THREE.MeshBasicMaterial( {color: 0xDDA0DD,  wireframe: true} );
	mesh = new THREE.Mesh(geometry, material);

	pyramid.add(mesh);
	pyramid.position.set(x, y, z);
	scene.add(pyramid);
}

function createCamera(){
	'use strict';
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.x = 50;
	camera.position.y = 50;
	camera.position.z = 50;
	camera.lookAt(scene.position);
}

function createScene(){
	'use strict';
	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(10));

	createFigure1(-30, 30, 30);
	createFigure2(10, -10, -10);
	createPlane(0, 0, 0);
	createTube(-10, 0, -50);
	createCube(-10, -20, 25, 0xFFFFE0);
	createCube(-20, -15, 15, 0x7FFFD4);
	createCube(-15, -25, 13, 0x98FB98);
	createPyramid(-10, 20, 10);
	createFigure3(-30, -40, 40);

	const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	scene.add( directionalLight );
	
}

function onResize() {
	'use strict';

	renderer.setSize(window.innerWidth, window.innerHeight);

	if(window.innerHeight > 0 && window.innerWidth > 0) {
		camera.aspect = renderer.getSize().width / renderer.getSize().height;
		camera.updateProjectionMatrix();
	}

	render();

}

function onKeyDown(e) {
	'use strict';

	switch (e.keyCode) {
		case 65: //A
		case 97: //a
			scene.traverse(function (node) {
				if (node instanceof THREE.Mesh) {
					node.material.wireframe = !node.material.wireframe;
				}
			});
			break;
		case 83: //S
		case 115: //s
			ball.userDate.jumping = !ball.userData.jumping;
			break;
	}

	render();

}

function animate() {
	'use strict';

	if (ball.userData.jumping) {
		ball.userData.step += 0.04;
		ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
		ball.position.z = 15 * (Math.cos(ball.userData.step));
	}
	render();

	requestAnimationFrame(animate);
}

function init(){
	'use strict';

	renderer = new THREE.WebGLRenderer({alpha: true});

	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	createScene();
	createCamera();

	render();

	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
}