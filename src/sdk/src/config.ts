require('dotenv').config()
import { PreloaderScene } from './scenes/preloaderScene'
import { ConnectWalletScene } from './scenes/connectWalletScene'
import { GameScene } from './scenes/gameScene'
import { UpgradeScene } from './scenes/upgradeScene'
import { CarSelectorScene } from './scenes/carSelectorScene'
import { BgScene } from './scenes/bgScene'

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Solana Gaming SDK',
  url: 'https://solana-gaming-sdk.pages.dev',
  version: '3.0',
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game',
    width: 1600,
    height: 900,
  },
  scene: [PreloaderScene, BgScene, ConnectWalletScene, UpgradeScene, GameScene, CarSelectorScene],
  input: {
    keyboard: true,
    mouse: true,
    touch: false,
    gamepad: false,
  },
  physics: {
    default: 'matter',
    matter: {
      debug: true,
    },
  },
  backgroundColor: '#000000',
  render: { pixelArt: false, antialias: true },
}
