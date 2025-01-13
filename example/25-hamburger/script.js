import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// loaders

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/static/draco/");


const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader)

const CubeTextureLoader = new THREE.CubeTextureLoader();

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// update all material
// getting all the elements related to the scene including whatever inside gltf model
const updateAllMaterial = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      // apply the environment to all the model componetns
      child.material.envMap = environmentMap;
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.castShadow = true
      child.receiveShadow = true
    }
  });
};

// environment map
const environmentMap = CubeTextureLoader.load([
  "./assets/textures/environmentMaps/0/px.jpg",
  "./assets/textures/environmentMaps/0/nx.jpg",
  "./assets/textures/environmentMaps/0/py.jpg",
  "./assets/textures/environmentMaps/0/ny.jpg",
  "./assets/textures/environmentMaps/0/pz.jpg",
  "./assets/textures/environmentMaps/0/nz.jpg",
]);
environmentMap.encoding = THREE.sRGBEncoding;
scene.background = environmentMap;
// apply the environment to all the model componetns
// scene.environment = environmentMap;

debugObject.envMapIntensity = 5;
gui
  .add(debugObject, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("mapintesity")
  .onChange(updateAllMaterial);

// models
gltfLoader.load(
  "./assets/models/Burger/burger3.glb",
  (gltf) => {
    console.log("success");

    // setting the model
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.position.set(0, -1, 0);
    gltf.scene.rotation.y = Math.PI * 0.5;
    scene.add(gltf.scene);

    // twiking with dat gui
    gui
      .add(gltf.scene.rotation, "y")
      .min(-Math.PI)
      .max(Math.PI)
      .step(0.001)
      .name("rotation");

    updateAllMaterial();
  },
  (progress) => console.log(),
  (err) => console.log(err)
);

// lights
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(-1.268, 3, -2.25);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.01
scene.add(directionalLight);

// adding light helper to scene 
// const directionLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionLightCameraHelper)

gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("lightIntesity");
gui
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightX");
gui
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightY");
gui
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightZ");

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
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true, //enable antialiasing
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.useLegacyLights = false;
renderer.outputEncoding = THREE.sRGBEncoding;
// select tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 3;
// shadow map
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

// tone mapping selection
gui.add(renderer, "toneMapping", {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
});

gui
  .add(renderer, "toneMappingExposure")
  .min(0)
  .max(10)
  .step(0.001)
  .name("renderer exposure");

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
