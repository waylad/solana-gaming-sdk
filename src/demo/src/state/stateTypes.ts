export type CarToken = {
  tokenId: string
  carCode: string
  price: number
  owned: boolean
  nft: any
}

export type LevelToken = {
  tokenId: string
  price: number
  owned: boolean
  pieces: any[]
  nft: any
}

export type State = {
  startTerrainHeight: number,
  amplitude: number,
  slopeLength: number[],
  mountainsAmount: number,
  slopesPerMountain: number,
  carAcceleration: number,
  maxCarVelocity: number,
  rocksRatio: number,
  mountainColors: number[],
  mountainColorsLineWidth: number[],
  paused: boolean,
  ownedCars: CarToken[],
  onSaleCars: CarToken[],
  currentCar: CarToken | null,
  ownedLevels: LevelToken[],
  onSaleLevels: LevelToken[],
  currentLevel: LevelToken | null,
}