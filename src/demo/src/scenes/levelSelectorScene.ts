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

  async displayLevel(this: Phaser.Scene, level: LevelToken, i: number) {
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
      textSelect = new Phaser.GameObjects.Text(this, 0, 204, level.nft.name, {
        fontFamily: 'Electrolize',
        align: 'center',
        wordWrap: { width: 330, useAdvancedWrap: true },
      })
        .setFontSize(30)
        .setOrigin(0.5)
        .setColor('#ECE0C4')

    let levelContainer = this.add.container(0, 0, [])
    levelContainer.setScale(0.4)

    this.add.container(this.sys.canvas.width / 2 - 580, this.sys.canvas.height / 2 - 290 + i * 260, [
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
        this.displayLevel(level, i)
      }
    }

    const buttonLevelBg = this.add.image(this.sys.canvas.width / 2 - 350, this.sys.canvas.height - 100, 'button-big')
    buttonLevelBg.setInteractive({ cursor: 'pointer' })
    const buttonLevelText = this.add
      .text(this.sys.canvas.width / 2 - 350, this.sys.canvas.height - 100, 'BUY OFFICIAL LEVEL', {
        fontFamily: 'Electrolize',
        align: 'center',
        wordWrap: { width: 600, useAdvancedWrap: true },
      })
      .setFontSize(34)
      .setOrigin(0.5)
    buttonLevelBg.on('pointerdown', async () => {
      buttonLevelText.setText('LOADING...')
      try {
        await mintLevel({ name: 'Official', price: 1, structure: [] })
        await getLevels()
        buttonLevelText.setText('BUY OFFICIAL LEVEL')
        this.scene.restart()
      } catch (e: any) {
        console.log(e)
        buttonLevelText.setText('BUY OFFICIAL LEVEL')
        alert(e)
      }
    })

    const buttonCreateBg = this.add.image(this.sys.canvas.width / 2 + 350, this.sys.canvas.height - 100, 'button-big')
    buttonCreateBg.setInteractive({ cursor: 'pointer' })
    const buttonCreateText = this.add
      .text(this.sys.canvas.width / 2 + 350, this.sys.canvas.height - 100, 'CREATE & SELL LEVEL', {
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
