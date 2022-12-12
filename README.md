# Solana Gaming SDK

This repository is a full-featured gaming SDK to create GameFi projects on Solana with Phaser.js, a very popular 2D game engine. This project has been created for the [Magic Eden Hackathon](https://gitcoin.co/hackathon/magic?) and submitted to all 4 tracks of the Hackathon because it implements different solutions adapted to each track. @Judges, please consider each track separately:

🤖 [**Future Of Royalties**](https://gitcoin.co/issue/29544) > The SDK requires ownership of an NFT to access the game (token-gated game). Additionally, it blocks access to the game if it detects that this NFT has been purchased without paying the proper royalties (we call this royalty-gated access). In that situation, it offers the player to pay a small fee to compensate the creator for the unpaid royalty and to access the game.

🚀 [**Ancillary Revenue Opportunities**](https://gitcoin.co/issue/29545) > The SDK offers the possibility for anyone to create new levels for the game thanks to a level creator that allows you to tokenize your levels and sell them as NT-SFT (Non-Transferrable Semi-Fungible Tokens). This takes advantage of the creator economy. Level creators can earn money by designing and selling their levels to players. We chose to implement a Non Transferable logic so players always purchase levels from their creators and thus making bypassing royalties impossible. Just like purchasing a game on Steam, players can no longer resell them. That means more money for the creators.

🤩 [**(Special) Judges' Awards**](https://gitcoin.co/issue/29546) > In the optic of developing a full-featured gaming SDK, we have implemented many features that are not directly related to royalties but important for the project in general, including:

- NFT Genetic Code: Each attribute of the NFT is encoded in a digit from 0 to 9 representing the level of that attribute (e.g. intelligence, force, etc…). All attributes make a genetic code (e.g. 0120763) that represents the character encoding in the NFT.
- NFT on-chain Upgrade: The Genetic code of the NFT can be changed on-chain allowing for character upgrades within the game
- Phaser.js boilerplate scenes to connect wallet, select NFT, upgrade NFT, and play the game
- Physics Engine integration with [Matter.js](https://brm.io/matter-js/demo/#car) to make games that use gravity, collisions, friction, etc…

💻 [**Bonus Track: Royalty Tracking API**](https://gitcoin.co/issue/29609) > The royalty-gating feature presented above uses the [Coral Qube API](https://optemization.notion.site/optemization/Coral-Cube-Royalty-API-Documentation-4c37410d75ed40fe84ec212c82e33ac2) to determine if a holder has paid royalties or not.

# Demo Video :

Coming soon...

# Play Demo

https://solana-gaming-sdk.pages.dev/
