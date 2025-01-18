import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    // options
    this.sources = sources;
    // console.log(sources);

    // setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;
    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }

  startLoading() {
    // console.log(this.sources);
    // load each source
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file);

          },
          (progress) => {},
          (error) => console.log(error)
        );
      }
    }
  }

  sourceLoaded(source, file)
  {
    this.items[source.name] = file 
    this.loaded++
    if (this.loaded === this.toLoad) {
        this.trigger('ready')
    }
  }
}
