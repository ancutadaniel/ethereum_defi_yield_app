const TokenFarm = artifacts.require('TokenFarm');
const Dacether = artifacts.require('Dacether');
const Dai = artifacts.require('Dai');

const { assert } = require('chai');
const chai = require('chai');

chai.use(require('chai-as-promised')).should();

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

const tokens = (n) => {
  return web3.utils.toWei(n, 'ether');
};

contract('TokenFarm', async ([owner, investor]) => {
  let tokenFarm, dacether, dai;

  before(async () => {
    // Load contracts
    dacether = await Dacether.new();
    dai = await Dai.new();
    tokenFarm = await TokenFarm.new(dacether.address, dai.address);

    // transfer tokens to token farm
    await dacether.transfer(tokenFarm.address, tokens('1000000'));

    // transfer dai tokens to investor
    await dai.transfer(investor, tokens('100'), { from: owner });
  });

  describe('deployment of the contract', async () => {
    it('contract deployed successfully and has a address', async () => {
      const address = await tokenFarm.address;

      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      assert.isString(address);
    });

    it('check the name of the contracts', async () => {
      const nameT = await tokenFarm.name();
      const nameDc = await dacether.name();
      const nameD = await dai.name();

      assert.equal(nameT, 'Token Farm', 'Contract has no name set');
      assert.equal(nameDc, 'Dacether Token', 'Contract has no name set');
      assert.equal(nameD, 'DAI Token', 'Contract has no name set');
    });

    it('should assert true', async function () {
      await TokenFarm.deployed();
      return assert.isTrue(true);
    });

    describe('Token Farm', async () => {
      it('contract has tokens', async () => {
        let balance = await dacether.balanceOf(tokenFarm.address);
        assert.equal(balance, tokens('1000000'), 'not all tokens transferred');
      });
    });

    describe('Farming tokens', async () => {
      it('rewards investors for staking Dai tokens', async () => {
        let result;
        // check investor balance before staking
        result = await dai.balanceOf(investor);
        assert.equal(
          result.toString(),
          tokens('100'),
          'investor balance wallet before staking'
        );

        // approve the Dai token to be spend before use transferFrom fct
        await dai.approve(tokenFarm.address, tokens('100'), { from: investor });
        await tokenFarm.stakeTokens(tokens('100'), { from: investor });

        // check investor balance after staking
        result = await dai.balanceOf(investor);
        assert.equal(
          result.toString(),
          tokens('0'),
          'investor balance wallet after staking'
        );

        // check tokenFarm balance after staking
        result = await dai.balanceOf(tokenFarm.address);
        assert.equal(result, tokens('100'), 'token farm balance after staking');

        // check staking balance also
        result = await tokenFarm.stakingBalance(investor);
        assert.equal(
          result,
          tokens('100'),
          'staking balance investor should be correct'
        );
      });
      it('check investor is staking', async () => {
        let result;
        // check investor is staking
        result = await tokenFarm.isStaking(investor);
        assert.isTrue(result, 'investor is staking');

        // issue tokens
        await tokenFarm.issueTokens({ from: owner });

        result = await dacether.balanceOf(investor);
        assert.equal(
          result,
          tokens('100'),
          'investor balance correct after issue token'
        );

        // only owner can call this
        await tokenFarm.issueTokens({ from: investor }).should.be.rejected;
      });

      it('unstacked Tokens ', async () => {
        let result;
        await tokenFarm.unstackedTokens({ from: investor });

        result = await dai.balanceOf(investor);
        assert.equal(
          result,
          tokens('100'),
          'investor should have the tokens back'
        );

        result = await dai.balanceOf(tokenFarm.address);
        assert.equal(
          result,
          tokens('0'),
          'token farm should have the 0 tokens'
        );

        result = await tokenFarm.stakingBalance(investor);
        assert.equal(
          result,
          tokens('0'),
          'staking balance of the investor is 0'
        );

        result = await tokenFarm.isStaking(investor);
        assert.isFalse(result, 'investor is no longer staking');
      });
    });
  });
});
