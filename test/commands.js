const instance = await NftMarket.deployed();

instance.mintToken(
  "https://scarlet-fancy-duck-326.mypinata.cloud/ipfs/bafkreie4lthm53h5inmtxvbyhdlo6uh7qfh5ers6xu5lvllzcg2jl4gfnq",
  "500000000000000000",
  { value: "25000000000000000", from: accounts[0] }
);

instance.mintToken(
  "https://scarlet-fancy-duck-326.mypinata.cloud/ipfs/bafkreiaxocjokydq6qrlmw7svdo4znj57j3ih5zbpmbvdbewpoxrgzj3ca",
  "30000000000000000",
  { value: "25000000000000000", from: accounts[0] }
);