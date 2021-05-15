const Migrations = artifacts.require("CryptoCoffee");

module.exports = function(deployer) {
//  erc20Address = '0xc2ff643aae61Ecb815e80Dc34A510381BB452d58' 
  deployer.deploy(Migrations)
    .then(() => {
      console.log(Migrations.address) 
  })
};

// ERC721_CONTRACT_ADDRESS: 0x274066FD908F5f20a99A1Ce231A3Dd7123D72BA6