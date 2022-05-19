import React from 'react';
import * as ACTIONS from '../redux_hooks/constants';
import { Card, Form, Button } from 'semantic-ui-react';

import daiLogo from '../dai.png';

const Stake = ({ state, dispatch }) => {
  const {
    web3,
    account,
    loading,
    daiBalance,
    amount,
    contractDai,
    contractTokenFarm,
    stakingBalanceDCT,
  } = state;
  const { SET_ERROR, SET_AMOUNT, SET_LOADING, SET_STAKING, SET_RELOAD_DATA } =
    ACTIONS;

  const handleChange = (e) => {
    dispatch({ type: SET_AMOUNT, value: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: SET_LOADING });
    try {
      const amountToWei = web3.utils.toWei(amount, 'ether');
      // 1  - approve transfer of tokens
      await contractDai.methods
        .approve(contractTokenFarm.options.address, amountToWei)
        .send({ from: account });

      // 2 - stake tokens by contract
      await contractTokenFarm.methods
        .stakeTokens(amountToWei)
        .send({ from: account });

      dispatch({ type: SET_STAKING });
    } catch (error) {
      dispatch({ type: SET_ERROR, value: error });
    }
  };

  const handleWithdraw = async () => {
    dispatch({ type: SET_LOADING });
    try {
      await contractTokenFarm.methods.unstackedTokens().send({ from: account });
      dispatch({ type: SET_RELOAD_DATA });
    } catch (error) {
      dispatch({ type: SET_ERROR, value: error });
    }
  };

  const handleReward = async () => {
    try {
      await contractTokenFarm.methods.issueTokens().send({ from: account });
      dispatch({ type: SET_RELOAD_DATA });
    } catch (error) {
      dispatch({ type: SET_ERROR, value: error });
    }
  };

  return (
    <Card style={{ width: '100%' }}>
      <Form
        loading={loading}
        onSubmit={handleSubmit}
        style={{
          padding: '20px',
          backgroundColor: 'rgba(100,53,201,0.2)',
        }}
      >
        <Form.Field>
          <label>
            <b>Stake Tokens</b>
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
            }}
          >
            <input
              style={{ width: '300px' }}
              type='text'
              placeholder='0'
              onChange={handleChange}
              value={amount}
              required
            />
            <span style={{ display: 'flex', alignItems: 'center' }}>
              Wallet Balance: {web3?.utils?.fromWei(daiBalance, 'Ether')}{' '}
              <span style={{ marginRight: '20px' }}>&nbsp; DAI</span>
              <img src={daiLogo} height='32' alt='' />
            </span>
          </div>
        </Form.Field>
        <div
          style={{
            display: 'flex',
            marginBottom: '15px',
          }}
        >
          <span>Reward Rate:&nbsp;</span>
          <span>1 DCT = 1 DAI</span>
        </div>
        <Button type='submit' color='teal'>
          STAKE!
        </Button>
        <Button
          type='button'
          color='orange'
          onClick={handleWithdraw}
          disabled={!+stakingBalanceDCT}
        >
          UN-STAKE..!
        </Button>
        <Button type='button' color='blue' onClick={handleReward}>
          REWARD TOKENS
        </Button>
      </Form>
    </Card>
  );
};

export default Stake;
