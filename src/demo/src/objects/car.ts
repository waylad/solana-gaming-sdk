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
    let group = scene.matter.world.nextGroup(true)
    let carBody = scene.matter.add.image(x, y, `car${indexCar}`)
    carBody.setScale(0.5)
    carBody.setBody(
      {
        type: 'circle',
        radius: 50,
      },
      {
        label: 'carBody',
        collisionFilter: {
          group: group,
        },
        density: 0.002,
      },
    )

    // -------- Boost -------- //
    let boostBody = scene.matter.add.image(x, y, `boost${indexBoost}`)
    boostBody.setScale(0.5)
    boostBody.setBody(
      {
        type: 'circle',
        radius: 50,
      },
      {
        label: 'armor',
        collisionFilter: {
          'group': -1,
          'category': 2,
          'mask': 0,
        },
        density: 0.0002,
      },
    )
    scene.matter.add.constraint(carBody.body as BodyType, boostBody.body as BodyType, 0, 1, {
      pointA: {
        x: -20,
        y: 0,
      },
      pointB: {
        x: -20,
        y: 0,
      },
    })
    scene.matter.add.constraint(carBody.body as BodyType, boostBody.body as BodyType, 0, 1, {
      pointA: {
        x: 20,
        y: 0,
      },
      pointB: {
        x: 20,
        y: 0,
      },
    })

    // -------- Gun -------- //
    let gunBody = scene.matter.add.image(x, y, `gun${indexGun}`)
    gunBody.setScale(0.5)
    gunBody.setBody(
      {
        type: 'circle',
        radius: 50,
      },
      {
        label: 'gun',
        collisionFilter: {
          'group': -1,
          'category': 2,
          'mask': 0,
        },
        density: 0.0002,
      },
    )
    scene.matter.add.constraint(carBody.body as BodyType, gunBody.body as BodyType, 0, 1, {
      pointA: {
        x: -20,
        y: 0,
      },
      pointB: {
        x: -20,
        y: 0,
      },
    })
    scene.matter.add.constraint(carBody.body as BodyType, gunBody.body as BodyType, 0, 1, {
      pointA: {
        x: 20,
        y: 0,
      },
      pointB: {
        x: 20,
        y: 0,
      },
    })

    // -------- Armor -------- //
    let armorBody = scene.matter.add.image(x, y, `armor${indexArmor}`)
    armorBody.setScale(0.5)
    armorBody.setBody(
      {
        type: 'circle',
        radius: 50,
      },
      {
        label: 'armor',
        collisionFilter: {
          'group': -1,
          'category': 2,
          'mask': 0,
        },
        density: 0.0002,
      },
    )
    scene.matter.add.constraint(carBody.body as BodyType, armorBody.body as BodyType, 0, 1, {
      pointA: {
        x: -20,
        y: 0,
      },
      pointB: {
        x: -20,
        y: 0,
      },
    })
    scene.matter.add.constraint(carBody.body as BodyType, armorBody.body as BodyType, 0, 1, {
      pointA: {
        x: 20,
        y: 0,
      },
      pointB: {
        x: 20,
        y: 0,
      },
    })

    // -------- Wheel -------- //
    let wheelA = scene.matter.add.image(x + wheelAOffset, y + wheelYOffset, `singleWheel${indexWheel}`)
    wheelA.setScale(0.5)
    wheelA.setBody(
      {
        type: 'circle',
        radius: wheelSize,
      },
      {
        label: 'wheelRear',
        collisionFilter: {
          group: group,
        },
        friction,
        density,
      },
    )

    let wheelB = scene.matter.add.image(x + wheelBOffset, y + wheelYOffset, `singleWheel${indexWheel}`)
    wheelB.setScale(0.5)
    wheelB.setBody(
      {
        type: 'circle',
        radius: wheelSize,
      },
      {
        label: 'wheelFront',
        collisionFilter: {
          group: group,
        },
        friction,
        density,
      },
    )

    let axelA = scene.matter.add.constraint(carBody.body as BodyType, wheelA.body as BodyType, 0, 0.2, {
      pointA: { x: wheelAOffset, y: wheelYOffset },
    })

    let axelB = scene.matter.add.constraint(carBody.body as BodyType, wheelB.body as BodyType, 0, 0.2, {
      pointA: { x: wheelBOffset, y: wheelYOffset },
    })

    this.bodies = [carBody.body, wheelA.body, wheelB.body]
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
