import * as THREE from 'three'
import Time from "./time"
import Sizes from "./utils/sizes"
import Camera from './camera'


export default class Experience
{
    constructor(canvas, ){
        // console.log('it begains')
        window.experience = this 

        // options 
        this.canvas = canvas


        // setup 
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.scene()
        this.camera = new Camera()

        // sizes resize event 
        this.sizes.on('resize', () => {
            this.resize()
        })

        this.time.on('tick', () => {
            this.update()
        })
    }

    resize(){

        console.log('i heard a resize')
    }

    update() {

    }
}