import { LevelToken } from 'state/stateTypes'

import { getLevels, mintLevel } from '../blockchain/lib'
import { state } from '../state/state'

export class LevelSelectorScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'LevelSelector',
    })
  }

  init(): void {}

  preload(): void {}

  async displayLevel(this: Phaser.Scene, level: LevelToken, i: number, j: number) {
    const levelCell = this.add.image(0, 0, 'level-bg')

    // Select
    let buttonSelect: any = new Phaser.GameObjects.Text(this, 0, 0, '', {})
    if (level.owned) buttonSelect = this.add.image(0, 200, 'button-small')
    buttonSelect.setInteractive({ cursor: 'pointer' })
    buttonSelect.on('pointerdown', async () => {
      state.currentLevel = level
      this.scene.start('Garage')
    })
    let textSelect: any = new Phaser.GameObjects.Text(this, 0, 0, '', {})
    if (level.owned)
      textSelect = new Phaser.GameObjects.Text(this, 0, 204, 'PLAY', {
        fontFamily: 'Electrolize',
        align: 'center',
        wordWrap: { width: 330, useAdvancedWrap: true },
      })
        .setFontSize(30)
        .setOrigin(0.5)
        .setColor('#ECE0C4')

    let levelContainer = this.add.container(0, 0, [])
    levelContainer.setScale(0.4)

    this.add.container(this.sys.canvas.width / 2 - 580 + (i % 4) * 380, this.sys.canvas.height / 2 - 290 + j * 360, [
      levelCell,
      levelContainer,
      buttonSelect,
      textSelect,
    ])
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
      .text(50, 15, 'MY LEVELS', {
        fontFamily: 'Electrolize',
        align: 'center',
        wordWrap: { width: 240, useAdvancedWrap: true },
      })
      .setFontSize(30)
      .setOrigin(0)
      .setColor('#ECE0C4')

    for (let i = 0; i < 4; i++) {
      let level = state.ownedLevels[i]
      if (level && level.tokenId) {
        this.displayLevel(level, i, 0)
      }
    }

    const button1Bg = this.add.image(this.sys.canvas.width / 2 - 350, this.sys.canvas.height - 100, 'button-big')
    button1Bg.setInteractive({ cursor: 'pointer' })
    const button1Text = this.add
      .text(this.sys.canvas.width / 2 - 350, this.sys.canvas.height - 100, 'BUY LEVEL', {
        fontFamily: 'Electrolize',
        align: 'center',
        wordWrap: { width: 600, useAdvancedWrap: true },
      })
      .setFontSize(34)
      .setOrigin(0.5)
    button1Bg.on('pointerdown', async () => {
      button1Text.setText('LOADING...')
      try {
        await mintLevel('Official')
        await getLevels()
        button1Text.setText('BUY LEVEL')
        this.scene.restart()
      } catch (e: any) {
        console.log(e)
        button1Text.setText('BUY LEVEL')
        alert(e)
      }
    })

    const buttonCreateBg = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height - 100, 'button-big')
    buttonCreateBg.setInteractive({ cursor: 'pointer' })
    const buttonCreateText = this.add
      .text(this.sys.canvas.width / 2, this.sys.canvas.height - 100, 'CREATE & SELL LEVEL', {
        fontFamily: 'Electrolize',
        align: 'center',
        wordWrap: { width: 600, useAdvancedWrap: true },
      })
      .setFontSize(34)
      .setOrigin(0.5)
    buttonCreateBg.on('pointerdown', async () => {
      this.scene.start('LevelEditor')
    })
  }

  update(): void {}
}
