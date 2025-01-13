import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

// raycaster
const raycaster = new THREE.Raycaster();

// // set the rays origin
// const rayOrigin= new THREE.Vector3(-3, 0, 0)

// // set rays direction
// const rayDirection = new THREE.Vector3(10, 0, 0)
// // convert the rayDirection value normalize
// rayDirection.normalize()

// raycaster.set(rayOrigin, rayDirection)

// const intersect = raycaster.intersectObject(object3)

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)

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

// mouse
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
  // console.log(mouse);
});

window.addEventListener("click", () => {
  if (currentIntersect) {
    console.log(currentIntersect);
  }
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
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// model
const gltfLoader = new GLTFLoader();
let model = null;

gltfLoader.load("/assets/models/Duck/glTF-Binary/Duck.glb", (gltf) => {
  model = gltf.scene;
  gltf.scene.position.y = -1.2;
  scene.add(gltf.scene);
});

// lights
const ambientLight = new THREE.AmbientLight("#ffffff", 0.3);
scene.add(ambientLight);

const directionLight = new THREE.DirectionalLight("#ffffff", 0.7);
directionLight.position.set(1, 2, 1);
scene.add(directionLight);

/**
 * Animate
 */
const clock = new THREE.Clock();

let currentIntersect = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // animate object
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.2) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 0.4) * 1.5;

  // cast a ray
  raycaster.setFromCamera(mouse, camera);

  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  for (const object of objectsToTest) {
    object.material.color.set("#ff0000");
  }

  for (const intersect of intersects) {
    intersect.object.material.color.set("#0000ff");
  }

  if (intersects.length) {
    if (currentIntersect === null) {
    }
    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
    }
    currentIntersect = null;
  }

  if (model) {
    const modelIntersects = raycaster.intersectObject(model);
    console.log(modelIntersects);
    if (modelIntersects.length > 0) {
      model.scale.set(1.2, 1.2, 1.2)
    }else{

      model.scale.set(1, 1, 1)
    }
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
