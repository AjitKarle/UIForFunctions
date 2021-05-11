const Migrations = artifacts.require("CryptoCoffee");

module.exports = function(deployer) {
  erc20Address = '0x1483eB2BD7E1e69F514b6350C27a98a0002EfFe3' 
  deployer.deploy(Migrations, erc20Address)
    .then(() => {
      console.log(Migrations.address) 
  })
};

// ERC721_CONTRACT_ADDRESS: 0xbaC3c76538fd002B8dEe175bEfBd80B4319c6176