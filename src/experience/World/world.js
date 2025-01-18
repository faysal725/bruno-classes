import * as THREE from "three";
import Experience from "../experience";
import Environment from "./environment";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // test mesh
    const testMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial()
    );
    this.scene.add(testMesh);

    this.resources.on("ready", () => {
      console.log('its ready')
      // class
      this.environment = new Environment();
    });
  }
}
