import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js'
import { clusterApiUrl, Connection } from '@solana/web3.js'
import axios from 'axios'
import BigNumber from 'bignumber.js'

import { state } from '../state/state'
import { CarToken } from '../state/stateTypes'
import { getProvider } from './utils'

let NETWORK: any = undefined
let provider: any = undefined
let connection: any = undefined
let metaplex: any = undefined

export const connectWallet = async () => {
  try {
    NETWORK = clusterApiUrl('devnet')
    provider = getProvider()
    connection = new Connection(NETWORK)
    metaplex = new Metaplex(connection)
    const resp = await provider.connect()
    metaplex.use(walletAdapterIdentity(provider))
  } catch (e: any) {
    console.log(e)
    // window.location.reload()
  }
}

export const getCars = async () => {
  try {
    const myNfts = await metaplex.nfts().findAllByOwner(metaplex.identity().publicKey).run()
    console.log(myNfts)
    myNfts.map((nft: any) => {
      if (nft.name.indexOf('SolSpace Ship') >= 0) {
        state.ownedCars.push({
          tokenId: `${Math.floor(Math.random() * 10000)}`,
          carCode: nft.name.replace('SolSpace Ship ', ''),
          price: 0,
          owned: true,
        })
      }
    })
    // state.ownedCars = JSON.parse(localStorage.getItem('ownedCars') || '[]')
    // console.log(state.ownedCars)
  } catch (e: any) {
    console.log(e)
    // window.location.reload()
  }
}

export const mintBasicCar = async () => {
  const { nft } = await metaplex
    .nfts()
    .create({
      uri: 'https://solana-gaming-sdk.pages.dev/assets/cars/00000000.json',
      name: 'Car 00000000',
      symbol: 'CAR',
      sellerFeeBasisPoints: 500, // Represents 5.00%.
    })
    .run()
  console.log(nft)
}

export const buyCar = async (carToken: CarToken) => {
  // TODO
}

export const sellCar = async (carToken: CarToken, price: number) => {
  // TODO
}

export const upgradeCar = async (carToken: CarToken) => {
  // Not working for some reason....
  // const { nft: updatedNft } = await metaplex
  //   .nfts()
  //   .update(carToken.nft, {
  //     uri: `https://solana-gaming-sdk.pages.dev/assets/cars/${carToken.carCode}.json`,
  //     name: `Car ${carToken.carCode}`,
  //     symbol: 'CAR',
  //     sellerFeeBasisPoints: 500, // Represents 5.00%.
  //   })
  //   .run()
  // console.log(updatedNft)
}
