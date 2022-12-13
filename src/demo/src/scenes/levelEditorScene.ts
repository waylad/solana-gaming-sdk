import { state } from '../state/state'
import { simplify } from './simplify'
import Car from '../objects/car'

import * as MatterJS from 'matter-js'
// @ts-ignore: Property 'Matter' does not exist on type 'typeof Matter'.
const Matter: typeof MatterJS = Phaser.Physics.Matter.Matter

export class LevelEditorScene extends Phaser.Scene {
  private floorPool: any
  private zombiesPool: any

  constructor(aParams) {
    super({
      key: 'LevelEditor',
      physics: {
        default: 'matter',
        matter: {
          gravity: { y: 0 },
        },
      },
    })
  }

  private preload(): void {}

  private create(): void {
    this.floorPool = []
    this.zombiesPool = []

    for (let i = 0; i < 10; i++) {
      let rect = this.add.rectangle(100, this.sys.canvas.height - 100, 300, 50, 0x534c45, 1)
      rect.setRotation(0)
      this.matter.add.gameObject(rect)
    }

    this.matter.add.mouseSpring({ length: 1, stiffness: 0.6 })
  }

  public update(time: number, dt: number): void {}
}
