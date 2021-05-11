const Migrations = artifacts.require("Cybercafe");

module.exports = function(deployer) {
  deployer.deploy(Migrations)
    .then(() => {
      console.log(Migrations.address) 
  })
};

// ERC20_CONTRACT_ADDRESS: 0x1483eB2BD7E1e69F514b6350C27a98a0002EfFe3 