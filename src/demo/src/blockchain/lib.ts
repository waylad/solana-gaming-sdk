import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js'
import { Cluster, clusterApiUrl, Connection } from '@solana/web3.js'
import axios from 'axios'
import BigNumber from 'bignumber.js'

import { state } from '../state/state'
import { CarToken } from '../state/stateTypes'
import { PhantomProvider } from './types'
import { getProvider } from './utils'

let provider: PhantomProvider | undefined = undefined
let connection: any = undefined
let metaplex: any = undefined
let NETWORK: Cluster = 'devnet'
let address: BigNumber | undefined = undefined

export const connectWallet = async () => {
  try {
    const network = clusterApiUrl(NETWORK)
    provider = getProvider()
    connection = new Connection(network)
    metaplex = new Metaplex(connection)
    address = metaplex.identity().publicKey
    console.log(BigNumber(address!).toString())
    if (provider) {
      await provider.connect()
      await metaplex.use(walletAdapterIdentity(provider))
    } else {
      alert('No Network Provider')
    }
  } catch (e: any) {
    console.log(e)
    // window.location.reload()
  }
}

export const getCars = async () => {
  try {
    state.ownedCars = []

    const myNfts = await metaplex.nfts().findAllByOwner({
      owner: metaplex.identity().publicKey,
    })

    console.log(myNfts)
    myNfts.map((nft: any) => {
      if (nft.name.indexOf('Car') >= 0) {
        state.ownedCars.push({
          tokenId: `${Math.floor(Math.random() * 10000)}`,
          carCode: nft.name.replace('Car ', ''),
          price: 0,
          owned: true,
          nft,
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

export const isRoyaltyPaid = async (carToken: CarToken) : Promise<boolean> => {
  if (NETWORK === 'mainnet-beta') {
    const result = await axios.get('https://api.coralcube.cc/0dec5037-f67d-4da8-9eb6-97e2a09ffe9a/inspector/getMintActivities?update_authority=3HAhTuNs7fqoELpc28tghfdcMzr7ZhBz23RLRRfUCPYp&collection_symbol=gamingsdk&limit=1') 
    return result.data?.[0]?.royalty_fee > 0
  } else {
    return carToken.nft.sellerFeeBasisPoints > 0
  }
}

export const mintBasicCarWithRoyalties = async () => {
  const { nft } = await metaplex.nfts().create({
    uri: 'https://solana-gaming-sdk.pages.dev/assets/cars/00000000.json',
    name: 'Car 00000000',
    symbol: 'CAR',
    sellerFeeBasisPoints: 500, // Represents 5.00%.
  })
  console.log(nft)
}

export const mintBasicCarWithoutRoyalties = async () => {
  const { nft } = await metaplex.nfts().create({
    uri: 'https://solana-gaming-sdk.pages.dev/assets/cars/00000000.json',
    name: 'Car 00000000',
    symbol: 'CAR',
    sellerFeeBasisPoints: 0, // Represents 0%.
  })
  console.log(nft)
}

export const buyCar = async (carToken: CarToken) => {
  // TODO
}

export const sellCar = async (carToken: CarToken, price: number) => {
  // TODO
}

export const upgradeCar = async (carToken: CarToken) => {
  // await metaplex.nfts().update({
  //   nftOrSft: nft,
  //   name: "My Updated Name"
  // });
  // Not working for some reason....
  // const { nft: updatedNft } = await metaplex
  //   .nfts()
  //   .update(carToken.nft, {
  //     uri: `https://solana-gaming-sdk.pages.dev/assets/cars/${carToken.carCode}.json`,
  //     name: `Car ${carToken.carCode}`,
  //     symbol: 'CAR',
  //     sellerFeeBasisPoints: 500, // Represents 5.00%.
  //   })
  // console.log(updatedNft)
}
