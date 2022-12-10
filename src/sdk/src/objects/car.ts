import { BodyType } from 'matter'
import { state } from '../state/state'

export default class Car {
  readonly MAX_SPEED = 1.75
  readonly MAX_SPEED_BACKWARDS = this.MAX_SPEED * 0.75
  readonly ACCELERATION = this.MAX_SPEED / 130
  readonly ACCELERATION_BACKWARDS = this.ACCELERATION * 0.75

  bodies: any[] = []
  gas = {
    right: false,
    left: false,
  }
  wheelsDown = {
    rear: false,
    front: false,
  }
  private _scene: Phaser.Scene

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number = 278,
    height: number = 100,
    wheelSize: number = 30,
    wheelOffset: { x: number; y: number } = { x: 38, y: 62 },
  ) {
    this._scene = scene
    const car = state.currentCar!
    let indexCar = parseInt(car.carCode[0])
    let indexBoost = parseInt(car.carCode[1])
    let indexWeight = parseInt(car.carCode[2])
    let indexGun = parseInt(car.carCode[3])
    let indexGear = parseInt(car.carCode[4])
    let indexArmor = parseInt(car.carCode[5])
    let indexWheel = parseInt(car.carCode[6])
    let indexFuel = parseInt(car.carCode[7])

    const wheelBase = wheelOffset.x,
      wheelAOffset = -width * 0.5 + wheelBase,
      wheelBOffset = width * 0.5 - wheelBase,
      wheelYOffset = wheelOffset.y

    const density = 0.001
    const friction = 0.9
    // @ts-ignore
    const Matter = Phaser.Physics.Matter.Matter

    // CBWGGAWF

    // -------- Car -------- //
    const carText = scene.add
      .text(1000, 100, `${state.currentCar!.carCode}`, {
        fontFamily: 'Electrolize',
        color: '#FFFFFF',
      })
      .setFontSize(42)

    let group = scene.matter.world.nextGroup(true)
    let carBody = scene.matter.add.rectangle(x, y, width, height, {
      label: 'carBody',
      collisionFilter: {
        group: group,
      },
      density: 0.001,
    })

    // -------- Wheels -------- //
    let wheelA = scene.matter.add.circle(x + wheelAOffset, y + wheelYOffset, 30, {
      friction: 1,
      restitution: 0,
      collisionFilter: {
        mask: 2,
      },
      label: 'wheel',
    })

    let wheelB = scene.matter.add.circle(x + wheelBOffset, y + wheelYOffset, 30, {
      friction: 1,
      restitution: 0,
      collisionFilter: {
        mask: 2,
      },
      label: 'wheel',
    })

    let axelA = scene.matter.add.constraint(carBody as BodyType, wheelA as BodyType, 0, 0.2, {
      pointA: { x: wheelAOffset, y: wheelYOffset },
    })

    let axelB = scene.matter.add.constraint(carBody as BodyType, wheelB as BodyType, 0, 0.2, {
      pointA: { x: wheelBOffset, y: wheelYOffset },
    })

    this.bodies = [carBody, wheelA, wheelB]
  }

  update() {
    // @ts-ignore
    const Matter = Phaser.Physics.Matter.Matter
    const carBody = this.bodies[0]
    const wheelRear = this.bodies[1]
    const wheelFront = this.bodies[2]

    let angularVelocity = 0.005

    if (this.gas.right) {
      let newSpeed = wheelRear.angularSpeed <= 0 ? this.MAX_SPEED / 10 : wheelRear.angularSpeed + this.ACCELERATION
      if (newSpeed > this.MAX_SPEED) newSpeed = this.MAX_SPEED
      Matter.Body.setAngularVelocity(wheelRear, newSpeed)
      Matter.Body.setAngularVelocity(wheelFront, newSpeed)
      // if (!this.wheelsDown.rear || !this.wheelsDown.front) Matter.Body.setAngularVelocity(carBody, -angularVelocity)
    } else if (this.gas.left) {
      let newSpeed =
        wheelRear.angularSpeed <= 0
          ? this.MAX_SPEED_BACKWARDS / 10
          : wheelRear.angularSpeed + this.ACCELERATION_BACKWARDS
      if (newSpeed > this.MAX_SPEED_BACKWARDS) newSpeed = this.MAX_SPEED_BACKWARDS

      Matter.Body.setAngularVelocity(wheelRear, -newSpeed)
      // if (!this.wheelsDown.rear || !this.wheelsDown.front) Matter.Body.setAngularVelocity(carBody, angularVelocity)
    }
  }
}
