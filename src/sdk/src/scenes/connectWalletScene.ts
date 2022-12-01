import { connectWallet, getCars } from '../blockchain/lib'

export class ConnectWalletScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'ConnectWallet',
    })
  }

  init(): void {}

  preload(): void {}

  create(): void {
    const bg = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'bg-home')
    
    const buttonBg = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2 + 250, 'button-big')
    buttonBg.setInteractive({cursor: 'pointer'})
    
    const buttonText = this.add
    .text(this.sys.canvas.width / 2, this.sys.canvas.height / 2 + 250, 'CONNECT WALLET', {
      fontFamily: 'Electrolize',
      align: 'center',
      wordWrap: { width: 600, useAdvancedWrap: true },
    })
    .setFontSize(34)
    .setOrigin(0.5)

    buttonBg.on('pointerdown', async () => {
      buttonText.setText('LOADING...')
      try {
        await connectWallet()
        await getCars()
        this.scene.start('Marketplace')
      } catch (e: any) {
        console.log(e)
        buttonText.setText('CONNECT WALLET')
        alert(e)
      }
    })
  }

  update(): void {}
}
