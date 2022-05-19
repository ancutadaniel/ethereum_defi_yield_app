import React, { useCallback, useEffect, useReducer } from 'react';
import { reducer } from './redux_hooks/redux';
import { defaultState } from './redux_hooks/state';
import * as ACTIONS from './redux_hooks/constants';
import getWeb3 from './utils/getWeb3';

import Dai from '../src/build/abi/Dai.json';
import Dacether from '../src/build/abi/Dacether.json';
import TokenFarm from '../src/build/abi/TokenFarm.json';
import MainMenu from './components/Menu';

import { Container, Divider, Message } from 'semantic-ui-react';

import Header from './components/Header';
import Stake from './components/Stake';

const App = () => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const { account, errors, reloadData } = state;
  const { SET_WEB3, SET_ERROR } = ACTIONS;

  const loadWeb3 = useCallback(async () => {
    try {
      const web3 = await getWeb3();
      if (web3) {
        const [owner] = await web3.eth.getAccounts();
        // get networks id of deployed contract
        const getNetworkId = await web3.eth.net.getId();

        // get contracts data on this network
        const newDaiData = await Dai.networks[getNetworkId];
        const newDacetherData = await Dacether.networks[getNetworkId];
        const newTokenFarmData = await TokenFarm.networks[getNetworkId];
        // check contract deployed networks
        if (newDaiData && newDacetherData && newTokenFarmData) {
          // get contract deployed address
          const contractDaiAddress = newDaiData.address;
          const contractDacetherAddress = newDacetherData.address;
          const contractTokenFarmAddress = newTokenFarmData.address;

          // create a new instance of the contract - on that specific address
          const contractDaiData = new web3.eth.Contract(
            Dai.abi,
            contractDaiAddress
          );

          const contractDacetherData = new web3.eth.Contract(
            Dacether.abi,
            contractDacetherAddress
          );

          const contractTokenFarmData = new web3.eth.Contract(
            TokenFarm.abi,
            contractTokenFarmAddress
          );

          const getDaiBalance = await contractDaiData.methods
            .balanceOf(owner)
            .call();

          const getDacetherBalance = await contractDacetherData.methods
            .balanceOf(owner)
            .call();

          const getStakingBalance = await contractTokenFarmData.methods
            .stakingBalance(owner)
            .call();

          dispatch({
            type: SET_WEB3,
            value: {
              web3: web3,
              contractDai: contractDaiData,
              contractDacether: contractDacetherData,
              contractTokenFarm: contractTokenFarmData,
              daiBalance: getDaiBalance,
              dacetherBalance: getDacetherBalance,
              stakingBalanceDCT: getStakingBalance,
              account: owner,
              loading: false,
              reloadData: false,
            },
          });
        } else {
          alert('Smart contract not deployed to selected network');
        }
      }
    } catch (error) {
      dispatch({ type: SET_ERROR, value: error });
    }
  }, [SET_WEB3, SET_ERROR]);

  useEffect(() => {
    reloadData && loadWeb3();
  }, [reloadData, loadWeb3]);

  useEffect(() => {
    loadWeb3();
  }, [loadWeb3]);

  console.log(state);

  return (
    <div className='App'>
      <MainMenu account={account} />
      <Container>
        <Header state={state} />
        <Divider horizontal>§</Divider>
        <Stake state={state} dispatch={dispatch} />
      </Container>
      <Container>
        {errors && (
          <Message negative>
            <Message.Header>Code: {errors?.code}</Message.Header>
            <p style={{ wordWrap: 'break-word' }}>{errors?.message}</p>
          </Message>
        )}
      </Container>
    </div>
  );
};

export default App;
