import * as THREE from 'three'
import Time from "./time"
import Sizes from "./utils/sizes"
import Camera from './camera'
import Renderer from './renderer'
import World from './World/world'
import Resources from './utils/resources'
import sources from './sources'

let instance = null

export default class Experience
{
    constructor(canvas){

        if (instance) {
            return instance
        }

        instance = this

        // console.log('it begains')
        window.experience = this 

        // options 
        this.canvas = canvas


        // setup 
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        // sizes resize event 
        this.sizes.on('resize', () => {
            this.resize()
        })

        this.time.on('tick', () => {
            this.update()
        })
    }

    resize(){
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update()
        this.renderer.update()
    }
}