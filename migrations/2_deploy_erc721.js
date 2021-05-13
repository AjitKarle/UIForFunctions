const Migrations = artifacts.require("CryptoCoffee");

module.exports = function(deployer) {
//  erc20Address = '0xc2ff643aae61Ecb815e80Dc34A510381BB452d58' 
  deployer.deploy(Migrations)
    .then(() => {
      console.log(Migrations.address) 
  })
};

// ERC721_CONTRACT_ADDRESS: 0xA59773E28262881eF86b1159AF49CB5DE854e958