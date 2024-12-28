// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftMarket is ERC721URIStorage {
  using Counters for Counters.Counter;

  // If tokenId => NftItem, why NftItem need save tokenId??  
  // STRUC CANNOT ENDED WITH `;`
  struct NftItem {
    uint tokenId;
    uint price;
    address creator;
    bool isListed;
  }

  uint public listingPrice = 0.025 ether;

  Counters.Counter private _listedItems;
  Counters.Counter private _tokenIds;

  mapping(string => bool) private _usedTokenURIs;
  mapping(uint => NftItem) private _idToNftItem;

  /*
   *  Events you can emit from your functions and listener from your Front-End
   *  
   *  The last argument/propertie cannot ended with `,`
   */
  event NftItemCreated (
    uint tokenId,
    uint price,
    address creator,
    bool isListed
  );

  constructor() ERC721("CreaturesNFT", "CNFT") {}

  function getNftItem(uint tokenId) public view returns(NftItem memory) {
    return _idToNftItem[tokenId];
  }

  function listedItemsCount() public view returns (uint) {
    return _listedItems.current();
  }

  function tokenURIExists(string memory tokenURI) public view returns (bool) {
    return _usedTokenURIs[tokenURI] == true;
  }

  /**
   *  _safeMint defined in ERV721
   *  _setTokenURI defined ERC721URIStorage
   *  _function convenction for private function
   */
  function mintToken(string memory tokenURI, uint price) public payable returns (uint) {
    // Prevent two token have same tokenURI
    require(!tokenURIExists(tokenURI), "Token URI already exists.");
    require(msg.value == listingPrice, "Price must be equal to listing price.");

    _tokenIds.increment();
    _listedItems.increment();

    uint newTokenId = _tokenIds.current();

    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);

    _usedTokenURIs[tokenURI] = true;

    _createNftItem(newTokenId, price);

    return newTokenId;
  }

  /*
   *  1. What NFT is beeing buying, tokenId
   *  2. Who owner this NFT, owner. Is price correct?
   *  3. Remove NFT to list and decrement listItems
   *  4. Transfer token to new owner
   *  5. Transfer ETH
   */
  function buyNft(uint tokenId) public payable {
    uint price = _idToNftItem[tokenId].price;

    // other contracts might have a ownerOf() function
    address owner = ERC721.ownerOf(tokenId);

    require(msg.sender != owner, "You already own this NFT!");
    require(msg.value == price, "Please submit the asking price.");

    _idToNftItem[tokenId].isListed = false;
    _listedItems.decrement();

    _transfer(owner, msg.sender, tokenId);
    payable(owner).transfer(msg.value);
  }

  function _createNftItem(uint tokenId, uint price) private {
    require(price > 0, "Price must be at least 1 wei.");

    _idToNftItem[tokenId] = NftItem(tokenId, price, msg.sender, true);

    emit NftItemCreated(tokenId, price, msg.sender, true);
  }
}