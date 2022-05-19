const TokenFarm = artifacts.require('TokenFarm');
// CLI =>  truffle exec scripts/issue-tokens.js

module.exports = async (callback) => {
  const tokenFarm = await TokenFarm.deployed();
  await tokenFarm.issueTokens();
  console.log('Token Issued!!');
  callback();
};
