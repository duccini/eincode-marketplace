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
});
