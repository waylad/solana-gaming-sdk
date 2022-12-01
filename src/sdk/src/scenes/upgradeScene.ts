import { upgradeCar } from '../blockchain/lib'
import { state } from '../state/state'

export class UpgradeScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'Upgrade',
    })
  }

  init(): void {}

  preload(): void {}

  replaceAt = function (original: string, index: number, replacement: string) {
    return original.substring(0, index) + replacement + original.substring(index + replacement.length)
  }

  create(): void {
    this.add.tileSprite(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      this.sys.canvas.width,
      this.sys.canvas.height,
      'bg-garage',
    )

    // CBWGGAWF
    const car = state.currentCar!

    const textCode = this.add
      .text(500, 220, `${state.currentCar!.carCode}`, {
        fontFamily: 'Electrolize',
        align: 'center',
        wordWrap: { width: 1600, useAdvancedWrap: true },
      })
      .setFontSize(120)
      .setOrigin(0)
      .setColor('#FFFFFF')

    for (let i = 0; i < 8; i++) {
      let index = parseInt(car.carCode[i])
      const x = 120 + i * 190
      const y = 765
      const upgrade = this.add.image(x, y, `upgrade`)
      const title = this.add
        .text(x - 40, y - 90, `Attr ${i}`, {
          fontFamily: 'Electrolize',
          align: 'center',
          wordWrap: { width: 160, useAdvancedWrap: true },
        })
        .setFontSize(24)
        .setOrigin(0)
        .setColor('#FFFFFF')
      const text = this.add
        .text(x - 20, y - 20, `${index}`, {
          fontFamily: 'Electrolize',
          align: 'center',
          wordWrap: { width: 160, useAdvancedWrap: true },
        })
        .setFontSize(60)
        .setOrigin(0)
        .setColor('#FFFFFF')
      upgrade.setInteractive({ cursor: 'pointer' })
      upgrade.on('pointerdown', () => {
        index < 3 ? (index += 1) : (index = 0)
        state.currentCar!.carCode = this.replaceAt(state.currentCar!.carCode, i, `${index}`)
        textCode.setText(state.currentCar!.carCode)
        text.setText(`${index}`)
        upgradeCar(state.currentCar!)
      })
    }

    let buttonNext = this.add.image(this.sys.canvas.width - 200, this.sys.canvas.height - 300, 'button-play')
    buttonNext.setInteractive({ cursor: 'pointer' })
    buttonNext.on('pointerdown', () => {
      this.scene.start('Bg')
      this.scene.start('Game')
    })
  }

  update(): void {}
}
