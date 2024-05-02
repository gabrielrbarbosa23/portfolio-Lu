import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


/*-------------------------- flash script  ---------------------------*/
document.querySelector('.button a').addEventListener('click', function (event) {
  event.preventDefault();
  var flashEffect = document.getElementById('flash-effect');
  flashEffect.style.opacity = '1';
  setTimeout(function () {
    flashEffect.style.opacity = '0';
    setTimeout(function () {
      flashEffect.style.opacity = '1';
      flashEffect.style.width = '200%';
      flashEffect.style.height = '200%';
      flashEffect.style.top = '50%';
      flashEffect.style.left = '50%';
      setTimeout(function () {
        window.location.href = 'aboutme.html';
      }, 400);
    }, 300);
  }, 125);
});

/*-------------------------- change camera position on button click  ---------------------------*/
document.querySelector('.button a').addEventListener('click', function (event) {
  event.preventDefault();

  changeCameraPositionForTransition();
});

/*-------------------------- script to spin the camera on click button  ---------------------------*/
function changeCameraPositionForTransition() {
  camera.position.set(0, 0, -4.5);

  var flashEffect = document.getElementById('flash-effect');
  flashEffect.style.opacity = '1';

  setTimeout(function () {
    flashEffect.style.opacity = '0';
    setTimeout(function () {
      flashEffect.style.opacity = '1';
      flashEffect.style.width = '200%';
      flashEffect.style.height = '200%';
      flashEffect.style.top = '50%';
      flashEffect.style.left = '50%';
      setTimeout(function () {
        window.location.href = 'aboutme.html';
      }, 400);
    }, 400);
  }, 150);
}

document.querySelector('.button a').addEventListener('click', function (event) {
  event.preventDefault();

  changeCameraPositionForTransition();
});

/*------------------------------- render o 3D object  ----------------------------------*/
/* Create object */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight); //render size
renderer.setClearColor(0x000000); //background color
renderer.setPixelRatio(window.devicePixelRatio); //pixel setup for high-density screen devices.

/* shadow mapping */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //soft shadow

/* add the object to the html */
document.body.appendChild(renderer.domElement);

/* Creating the scene (object, lights and shadow) */
const scene = new THREE.Scene();

/* defining the perspective and position */
const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(1.2, 1.9, -4.5); //x y z coordinates

/* scene interaction */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
//controls.minDistance = 5;
//controls.maxDistance = 6;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

/* Creating the floor of the scene */
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide,
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

/* Creating the light and shadow of the scene */
const spotLight = new THREE.SpotLight(0x001E3B, 5, 100, 0.22, 1);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0022;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

scene.add(spotLight);

/* using GLTFLoader to assemble the scene */
const loader = new GLTFLoader().setPath('public/millennium_falcon/');
loader.load('scene.gltf', (gltf) => {
  const mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.material.transparent = false;
      child.material.opacity = 1;
      child.material.depthWrite = true;
      child.material.depthTest = true;

      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  mesh.position.set(0, 1, 0);
  scene.add(mesh);

  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  document.getElementById('progress').innerHTML = `LOADING ${Math.max(xhr.loaded / xhr.total, 1) * 100}/100`;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* updates scene controls and create a smooth animation */
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();