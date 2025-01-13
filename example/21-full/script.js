import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import * as CANNON from "cannon-es";

console.log(CANNON);
/**
 * Debug
 */
const gui = new dat.GUI();
const debugObject = {};
debugObject.createSphere = () => {
  createSphere(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};
debugObject.createBox = () => {
  createBox(
    Math.random(), 
    Math.random(), 
    Math.random(), 
    {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};

debugObject.reset = () => {
  for(const object of objectToUpdate){

    // remove body 
    object.body.removeEventListener('collide', playHitSound)
    console.log(world)
    world.removeBody(object.body)

    // remove three mesh
    scene.remove(object.mesh)

    // empty the objecttoupdate array 
    // objectToUpdate.splice(0, objectToUpdate.length)
    objectToUpdate = []
  }
};


gui.add(debugObject, "createSphere");
gui.add(debugObject, "createBox");
gui.add(debugObject, "reset");

/**
 * BaseF
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sounds
 */
const hitSound = new Audio('/assets/sounds/brick-sound.mp3')
const bounceSound = new Audio('/assets/sounds/ball-bounce.mp3')

// this function first calculate the impact strength. then play the hitSound according to it 
const playHitSound = (impact) => {

  const impactStrength = impact.contact.getImpactVelocityAlongNormal()

  if(impactStrength > 1.5){
    hitSound.volume = Math.random()
    hitSound.currentTime = 0
    hitSound.play()
  }else{
    hitSound.volume = 0.005

  }
}

const playBounceSound = (impact) => {

  const impactStrength = impact.contact.getImpactVelocityAlongNormal()

  if(impactStrength > 1.5){
    bounceSound.volume = Math.random()
    bounceSound.currentTime = 0
    bounceSound.play()
  }else{
    bounceSound.volume = 0.005

  }
}

// texture
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/assets/textures/environmentMaps/0/px.jpg",
  "/assets/textures/environmentMaps/0/nx.jpg",
  "/assets/textures/environmentMaps/0/py.jpg",
  "/assets/textures/environmentMaps/0/ny.jpg",
]);

// physics
const world = new CANNON.World();

world.broadphase = new CANNON.SAPBroadphase(world)

// objects which has very less movement allowsleep makes it sleep which is very good for optimisation 
world.allowSleep = true

world.gravity.set(0, -9.82, 0);

// defining material in physics
const concreteMaterial = new CANNON.Material("concrete");
const plasticMaterial = new CANNON.Material("plastic");

// defining what will happend when materials collide with each other after
const concretePlasticContactMaterial = new CANNON.ContactMaterial(
  concreteMaterial,
  plasticMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);

const plasticContactMaterial = new CANNON.ContactMaterial(
  plasticMaterial,
  plasticMaterial,
  {
    friction: 0.3,
    restitution: 1,
  }
);

// add this material collide info in physics world
world.addContactMaterial(concretePlasticContactMaterial);
world.addContactMaterial(plasticContactMaterial);

// physics sphere
// const sphereShape = new CANNON.Sphere(0.5);
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape,
//   material: plasticMaterial
// });

// // force is applying on sphere body
// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
// world.addBody(sphereBody);

// physics floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0;
floorBody.addShape(floorShape);
floorBody.material = concreteMaterial;
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

// sphere
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5,
//   })
// );

// scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// lights
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let objectToUpdate = [];

// sphere create
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughtness: 0.4,
  envMap: environmentMapTexture,
});

// utils
const createSphere = (radius, position) => {
  // three js mesh
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // physics sphere
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: plasticMaterial,
  });
  body.position.copy(position);

  body.addEventListener('collide', playBounceSound)
  world.addBody(body);

  // save in object to update array
  objectToUpdate.push({
    mesh: mesh,
    body: body,
  });
};

createSphere(0.5, { x: 0, y: 3, z: 0 });

// box create
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughtness: 0.4,
  envMap: environmentMapTexture,
});

const createBox = (width, height, depth, position) => {
  // three js mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);

  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // physics sphere
  const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5));
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: plasticMaterial,
  });
  body.position.copy(position);
  body.addEventListener('collide', playHitSound)
  world.addBody(body);

  // save in object to update array
  objectToUpdate.push({
    mesh: mesh,
    body: body,
  });
};

// createBox(0.5, { x: 0, y: 3, z: 0 });

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // update physics world
  // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)
  world.step(1 / 60, deltaTime, 3);

  for (const object of objectToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }

  // marge physics body with three js sphere body
  // sphere.position.copy(sphereBody.position);

  // update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
