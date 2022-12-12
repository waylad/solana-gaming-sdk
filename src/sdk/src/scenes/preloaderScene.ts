declare let WebFont: any

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'Preloader',
    })
  }

  preload(): void {
    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(this.sys.canvas.width / 2 - 160, this.sys.canvas.height / 2 - 25, 320, 50)

    const percentText = this.make.text({
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2,
      text: '0%',
      style: {
        font: '18px monospace',
      },
    })
    percentText.setOrigin(0.5, 0.5)

    const assetText = this.make.text({
      x: this.sys.canvas.width / 2,
      y: this.sys.canvas.height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
      },
    })
    assetText.setOrigin(0.5, 0.5)

    this.load.on('progress', (value: number) => {
      percentText.setText(`${Math.floor(value * 100)} %`)
      progressBar.clear()
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(this.sys.canvas.width / 2 - 150, this.sys.canvas.height / 2 - 15, 300 * value, 30)
    })

    this.load.on('fileprogress', (file: any) => {
      assetText.setText('Loading asset: ' + file.key)
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      percentText.destroy()
      assetText.destroy()
      this.scene.start(process.env.STARTING_SCENE || 'ConnectWallet')
    })

    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')

    this.load.image('background', './assets/background.png')
    this.load.image('bg-home', './assets/bg-home.png')
    this.load.image('bg-garage', './assets/bg-garage.png')
    this.load.image('bg-level', './assets/bg-level.png')

    this.load.svg('button-play', './assets/button-play.svg')
    this.load.svg('car-bg', './assets/car-bg.svg')
    this.load.svg('button-big', './assets/button-big.svg')
    this.load.svg('button-small', './assets/button-small.svg')
    this.load.svg('button-garage', './assets/button-garage.svg')

    this.load.svg('upgrade', './assets/upgrade.svg')
  
  }

  create(): void {
    WebFont.load({
      custom: {
        families: ['Ethnocentric', 'Electrolize'],
      },
      active: function () {},
    })
  }

  update(): void {}
}
