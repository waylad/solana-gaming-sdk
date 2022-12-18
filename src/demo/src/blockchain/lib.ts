import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js'
import { Cluster, clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { create } from 'ipfs-http-client'

import { state } from '../state/state'
import { CarToken } from '../state/stateTypes'
import { PhantomProvider } from './types'
import { getProvider } from './utils'

let provider: PhantomProvider | undefined = undefined
let connection: any = undefined
let metaplex: Metaplex | undefined = undefined
let NETWORK: Cluster = 'devnet'
let address: PublicKey | undefined = undefined

export const connectWallet = async () => {
  try {
    const network = clusterApiUrl(NETWORK)
    provider = getProvider()
    connection = new Connection(network)
    metaplex = new Metaplex(connection)
    address = metaplex.identity().publicKey
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

    const myNfts = await metaplex!.nfts().findAllByOwner({
      owner: metaplex!.identity().publicKey,
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
  } catch (e: any) {
    console.log(e)
  }
}

export const getLevels = async () => {
  try {
    state.ownedCars = []

    const myNfts = await metaplex!.nfts().findAllByOwner({
      owner: metaplex!.identity().publicKey,
    })

    console.log(myNfts)
    myNfts.map((nft: any) => {
      if (nft.name.indexOf('Level') >= 0) {
        state.ownedLevels.push({
          tokenId: `${Math.floor(Math.random() * 10000)}`,
          pieces: [],
          price: 0,
          owned: true,
          nft,
        })
      }
    })
  } catch (e: any) {
    console.log(e)
  }
}

export const isRoyaltyPaid = async (carToken: CarToken): Promise<boolean> => {
  if (NETWORK === 'mainnet-beta') {
    const result = await axios.get(
      'https://api.coralcube.cc/0dec5037-f67d-4da8-9eb6-97e2a09ffe9a/inspector/getMintActivities?update_authority=3HAhTuNs7fqoELpc28tghfdcMzr7ZhBz23RLRRfUCPYp&collection_symbol=gamingsdk&limit=1',
    )
    return result.data?.[0]?.royalty_fee > 0
  } else {
    return carToken.nft.sellerFeeBasisPoints > 0
  }
}

export const payRoyalty = async (carToken: CarToken) => {
  var recieverWallet = new PublicKey('sE7rAdV5J9kddYtD4heKrcASgoVYmr52Ccj1irbC3Dg')

  // Airdrop some SOL to the sender's wallet, so that it can handle the txn fee
  var airdropSignature = await connection.requestAirdrop(provider?.publicKey, LAMPORTS_PER_SOL)

  // Confirming that the airdrop went through
  await connection.confirmTransaction(airdropSignature)
  console.log('Airdropped')

  var transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: provider?.publicKey!,
      toPubkey: recieverWallet,
      lamports: LAMPORTS_PER_SOL,
    }),
  )

  // Setting the variables for the transaction
  transaction.feePayer = await provider?.publicKey!
  let blockhashObj = await connection.getRecentBlockhash()
  transaction.recentBlockhash = await blockhashObj.blockhash

  // Transaction constructor initialized successfully
  if (transaction) {
    console.log('Txn created successfully')
  }

  // Request creator to sign the transaction (allow the transaction)
  let signed = await provider?.signTransaction(transaction)!
  // The signature is generated
  let signature = await connection.sendRawTransaction(signed.serialize())
  // Confirm whether the transaction went through or not
  await connection.confirmTransaction(signature)

  //Print the signature here
  console.log('Signature: ', signature)
}

export const mintBasicCarWithRoyalties = async () => {
  const { nft } = await metaplex!.nfts().create({
    uri: 'https://solana-gaming-sdk.pages.dev/assets/cars/00000000.json',
    name: 'Car 00000000',
    symbol: 'CAR',
    sellerFeeBasisPoints: 500, // Represents 5.00%.
  })
  console.log(nft)
}

export const mintBasicCarWithoutRoyalties = async () => {
  const { nft } = await metaplex!.nfts().create({
    uri: 'https://solana-gaming-sdk.pages.dev/assets/cars/00000000.json',
    name: 'Car 00000000',
    symbol: 'CAR',
    sellerFeeBasisPoints: 0, // Represents 0%.
  })
  console.log(nft)
}

export const mintLevel = async ({ name, price, structure }: { name: string; price: number; structure: any[] }) => {
  Buffer.from('ipfs', 'base64')

  const projectId = '29iQPvAdeIYGWCcM2wOQZLMljbt'
  const projectSecret = '95b36673339827ad7547cf8aff56d82b'
  const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')
  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  })

  const metadataUri = await client.add(
    JSON.stringify({
      name: name,
      description: 'A Solana Gaming SDK Level',
      external_url: 'https://solana-gaming-sdk.pages.dev/assets/zombie.svg',
      image: 'https://solana-gaming-sdk.pages.dev/assets/zombie.svg',
      attributes: structure,
    }),
  )
  console.log(`Metadata uploaded to https://cloudflare-ipfs.com/ipfs/${metadataUri.cid}`)

  const { nft } = await metaplex!.nfts().create({
    uri: `https://cloudflare-ipfs.com/ipfs/${metadataUri.cid}`, //`ipfs://${metadataUri.cid}`,
    name: `Level ${name}`,
    symbol: 'LEVEL',
    sellerFeeBasisPoints: 500, // Represents 5.00%.
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
