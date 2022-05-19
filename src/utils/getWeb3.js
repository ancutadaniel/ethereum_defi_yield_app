import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

const getWeb3 = async () => {
  const provider = await detectEthereumProvider();
  try {
    if (provider) {
      return new Web3(provider);
    }
    throw new Error('Please install MetaMask!');
  } catch (error) {
    return error;
  }
};

export default getWeb3;
