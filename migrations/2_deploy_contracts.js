const TokenFarm = artifacts.require('TokenFarm');
const Dacether = artifacts.require('Dacether');
const Dai = artifacts.require('Dai');

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(Dacether);
  const dacether = await Dacether.deployed();

  await deployer.deploy(Dai);
  const dai = await Dai.deployed();

  await deployer.deploy(TokenFarm, dacether.address, dai.address);
  const tokenFarm = await TokenFarm.deployed();

  // transfer all dacether token to the tokenFarm contract
  await dacether.transfer(tokenFarm.address, '1000000000000000000000000');

  // transfer 100 DAI tokens to investor
  await dai.transfer(accounts[1], '100000000000000000000');
};
