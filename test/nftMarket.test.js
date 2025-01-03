/* eslint-disable @typescript-eslint/no-require-imports */

/**
 *  This file will be executed by Truffle
 *  Truffle will compile the Smart COntract and execute this test
 *
 *  truffle assertions npm
 */
const NftMarket = artifacts.require("NftMarket");
const { ethers } = require("ethers");

contract("NftMarket", (accounts) => {
  let _contract = null;
  let _nftPrice = ethers.utils.parseEther("0.25").toString();
  let _listingPrice = ethers.utils.parseEther("0.025").toString();

  before(async () => {
    _contract = await NftMarket.deployed();
  });

  describe("Mint token", () => {
    const tokenURI = "https://test.com";

    /**
     *  everytime you are calling a function of the a Smart Contract you can pass aditional
     *  data, this additional data are passeded as an object, the last value of the function
     *  you are calling
     */
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
      });
    });

    it("owner of first token shoul be accounts[0]", async () => {
      const owner = await _contract.ownerOf(1);

      assert(
        owner == accounts[0],
        "Owner of first token is not matching accounts[0]"
      );
    });

    it("first token should point to the correct tokenURI", async () => {
      const actualTokenURI = await _contract.tokenURI(1);

      assert.equal(
        actualTokenURI,
        "https://test.com",
        "tokenURI is not correctly set."
      );
    });

    it("should not be possible to create a NFT with used tokenURI", async () => {
      try {
        await _contract.mintToken(tokenURI, _nftPrice, {
          from: accounts[0],
          value: _listingPrice,
        });
      } catch (error) {
        assert(error, "NFT was minted with previously used tokenURI");
      }
    });

    it("should have one listed item", async () => {
      const listedItemCount = await _contract.listedItemsCount();

      // uint returns BigNumber
      assert.equal(
        listedItemCount.toNumber(),
        "1",
        "Listed items count is not 1."
      );
    });

    it("should have have create NFT item", async () => {
      const nftItem = await _contract.getNftItem(1);

      // console.log(nftItem);

      assert.equal(nftItem.tokenId, 1, "Token id is not 1");
      assert.equal(nftItem.price, _nftPrice, "Nft price is not correct.");
      assert.equal(nftItem.creator, accounts[0], "Creator is not account[0].");
      assert.equal(nftItem.isListed, true, "Token is not listed.");
    });
  });

  describe("Buy NFT", () => {
    before(async () => {
      await _contract.buyNft(1, {
        from: accounts[1],
        value: _nftPrice,
      });
    });

    it("should unlist the item", async () => {
      const listedItem = await _contract.getNftItem(1);
      assert.equal(listedItem.isListed, false, "Item is still listed.");
    });

    it("should decrease listed items count", async () => {
      const listedItemCount = await _contract.listedItemsCount();
      assert.equal(
        listedItemCount.toNumber(),
        0,
        "Count has not been decremented."
      );
    });

    it("should change the owner", async () => {
      const currentOwner = await _contract.ownerOf(1);
      assert.equal(currentOwner, accounts[1], "Owner have not changed.");
    });
  });

  describe("Token  transfers", () => {
    const tokenURI = "https://test-json2.com";

    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
      });
    });

    it("should two NFTs created", async () => {
      const totalSupply = await _contract.totalSupply();
      assert.equal(
        totalSupply.toNumber(),
        2,
        "Total supply of token is not correct."
      );
    });

    it("should be able to retrive NFT by index", async () => {
      const nftId1 = await _contract.tokenByIndex(0);
      const nftId2 = await _contract.tokenByIndex(1);

      assert.equal(nftId1.toNumber(), 1, "NFT id is wrong.");

      assert.equal(nftId2.toNumber(), 2, "NFT id is wrong.");
    });

    // 2 NFTs created, 1 buyed, 1 still listed
    it("should have one listed NFT", async () => {
      const allNfts = await _contract.getAllNftsOnSale();

      assert.equal(allNfts[0].tokenId, 2, "NFT has a wrong id.");
    });

    /**
     *  account[0] mints NFT 1 and 2
     *  account[1] buy NFT 1 from account[0]
     *  account[0] stays with NFT 2 and account[1] stays with NFT 1
     */
    it("account 0 shoul have owned one NFT", async () => {
      // By default all call to the contract is made by account[0]
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });

      // console.log(`accounts[0]: ${accounts[0]}`);
      // console.log(ownedNfts);

      assert.equal(ownedNfts[0].tokenId, 2, "NFT has a wrong id.");
    });

    it("account 1 shoul have owned one NFT", async () => {
      // By default all call to the contract is made by account[0]
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });

      // console.log(`accounts[1]: ${accounts[1]}`);
      // console.log(ownedNfts);

      assert.equal(ownedNfts[0].tokenId, 1, "NFT has a wrong id.");
    });
  });

  describe("Token transfer to new owner", () => {
    // ERC721 transferFrom -> _transfer -> _beforeTokenTransfer
    before(async () => {
      // from, to, tokenId
      await _contract.transferFrom(accounts[0], accounts[1], 2);
    });

    it("accounts[0] should own 0 tokens", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
      assert.equal(ownedNfts.length, 0, "Wrong number of tokens.");
    });

    it("accounts[1] should own 2 tokens", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });
      assert.equal(ownedNfts.length, 2, "Wrong number of tokens.");
    });
  });

  // describe("Burn Token", () => {
  //   const tokenURI = "https://test-json3.com";

  //   before(async () => {
  //     await _contract.mintToken(tokenURI, _nftPrice, {
  //       from: accounts[2],
  //       value: _listingPrice,
  //     });
  //   });

  //   it("accounts[2] should own 1 tokens", async () => {
  //     const ownedNfts = await _contract.getOwnedNfts({ from: accounts[2] });
  //     // const allNfts = await _contract.getAllNftsOnSale();

  //     // console.log(ownedNfts);
  //     // console.log(allNfts);

  //     assert.equal(ownedNfts.length, 1, "Wrong number of tokens.");
  //   });

  //   it("accounts[2] should have 0 tokens", async () => {
  //     await _contract.burnToken(3, { from: accounts[2] });
  //     const ownedNfts = await _contract.getOwnedNfts({ from: accounts[2] });
  //     // const allNfts = await _contract.getAllNftsOnSale();

  //     // console.log(ownedNfts);
  //     // console.log(allNfts);

  //     assert.equal(ownedNfts.length, 0, "Wrong number of tokens.");
  //   });

  //   it("accounts[1] should have two NFTs and accounts[0] and accounts[2] should hane zero token", async () => {
  //     const allNftsOfAccounts0 = await _contract.balanceOf(accounts[0]);
  //     const allNftsOfAccounts1 = await _contract.balanceOf(accounts[1]);
  //     const allNftsOfAccounts2 = await _contract.balanceOf(accounts[2]);

  //     assert.equal(allNftsOfAccounts0.toNumber(), 0, "Wrong number of tokens.");
  //     assert.equal(allNftsOfAccounts1.toNumber(), 2, "Wrong number of tokens.");
  //     assert.equal(allNftsOfAccounts2.toNumber(), 0, "Wrong number of tokens.");
  //   });

  //   it("Token id 3 should not have an owner", async () => {
  //     try {
  //       await _contract.ownerOf(3);
  //     } catch (error) {
  //       assert(error, "Token Id 3 should not have an owner");
  //     }
  //   });
  // });

  describe("List an Nft", () => {
    before(async () => {
      _listingPrice = ethers.utils.parseEther("0.015").toString();
      _nftPrice = ethers.utils.parseEther("0.03").toString();
      await _contract.setListingPrice(_listingPrice);
      await _contract.placeNftOnSale(1, _nftPrice, {
        from: accounts[1],
        value: _listingPrice,
      });
    });

    it("should have two listed items", async () => {
      const listedNfts = await _contract.getAllNftsOnSale();

      // const listingPrice = await _contract.listingPrice();
      // console.log(listedNfts);
      // console.log(listingPrice.toString());

      assert.equal(listedNfts.length, 2, "Invalid number of NFTs on sale.");
    });
  });
});
