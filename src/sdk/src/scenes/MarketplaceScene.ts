import { CarToken } from 'state/stateTypes'

import { buyCar, getCars, mintBasicCar, sellCar } from '../blockchain/lib'
import { state } from '../state/state'

export class MarketplaceScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'Marketplace',
    })
  }

  init(): void {}

  preload(): void {}

  displayCar(this: Phaser.Scene, car: CarToken, i: number, j: number) {
    const carCell = this.add.image(0, 0, 'car-bg')

    const textCode = this.add
      .text(-90, -10, `${car.carCode}`, {
        fontFamily: 'Electrolize',
        align: 'center',
        wordWrap: { width: 200, useAdvancedWrap: true },
      })
      .setFontSize(30)
      .setOrigin(0)
      .setColor('#FFFFFF')

    // Select
    let buttonSelect: any = new Phaser.GameObjects.Text(this, 0, 0, '', {})
    if (car.owned) buttonSelect = this.add.image(-80, 160, 'button-small')
    buttonSelect.setInteractive({ cursor: 'pointer' })
    buttonSelect.on('pointerdown', async () => {
      state.currentCar = car
      this.scene.start('Upgrade')
    })
    let textSelect: any = new Phaser.GameObjects.Text(this, 0, 0, '', {})
    if (car.owned)
      textSelect = new Phaser.GameObjects.Text(this, -135, 144, 'SELECT', {
        fontFamily: 'Electrolize',
        align: 'center',
        wordWrap: { width: 140, useAdvancedWrap: true },
      })
        .setFontSize(30)
        .setOrigin(0)
        .setColor('#FFFFFF')

    this.add.container(
      this.sys.canvas.width / 2 - 580 + (i % 4) * 380,
      this.sys.canvas.height / 2 - 290 + j * 360,
      [carCell, buttonSelect, textSelect, textCode],
    )
  }

  create(): void {
    this.add.tileSprite(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      this.sys.canvas.width,
      this.sys.canvas.height,
      'background',
    )

    this.add.rectangle(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      this.sys.canvas.width,
      this.sys.canvas.height,
      0x000000,
      0.7,
    )

    this.add
      .text(50, 15, 'MY ASSETS', {
        fontFamily: 'Electrolize',
        align: 'center',
        wordWrap: { width: 240, useAdvancedWrap: true },
      })
      .setFontSize(30)
      .setOrigin(0)
      .setColor('#FFFFFF')

    for (let i = 0; i < 4; i++) {
      let car = state.ownedCars[i]
      if (car && car.carCode) {
        this.displayCar(car, i, 0)
      }
    }

    // this.add
    //   .text(50, 380, 'MARKETPLACE', {
    //     fontFamily: 'Electrolize',
    //     align: 'center',
    //     wordWrap: { width: 240, useAdvancedWrap: true },
    //   })
    //   .setFontSize(30)
    //   .setOrigin(0)
    //   .setColor('#FFFFFF')

    // for (let i = 0; i < 4; i++) {
    //   let car = state.onSaleCars[i]
    //   if (car && car.carCode) {
    //     this.displayCar(car, i, 1)
    //   }
    // }

    const buttonBg = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height - 100, 'button-big')
    buttonBg.setInteractive({cursor: 'pointer'})
    
    const buttonText = this.add
    .text(this.sys.canvas.width / 2, this.sys.canvas.height - 100, 'MINT BASIC ASSET', {
      fontFamily: 'Electrolize',
      align: 'center',
      wordWrap: { width: 600, useAdvancedWrap: true },
    })
    .setFontSize(34)
    .setOrigin(0.5)

    buttonBg.on('pointerdown', async () => {
      buttonText.setText('LOADING...')
      try {
        await mintBasicCar()
        await getCars()
        buttonText.setText('MINT BASIC ASSET')
        this.scene.restart()
      } catch (e: any) {
        console.log(e)
        buttonText.setText('MINT BASIC ASSET')
        alert(e)
      }
    })
  }

  update(): void {}
}
