// Swap token for USDT

require('dotenv').config();
const { ethers } = require('ethers');
const { getGasPrice } = require('./gas.js');

const privateKey = process.env.PRIVATE_KEY;
const rpcProvider = process.env.RPC_PROVIDER;
const gasLimit = 11620000; // Set a static gas limit

const fromTokenAddress = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';
const toTokenAddress = '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9';

async function swapTokens() {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcProvider);
    const wallet = new ethers.Wallet(privateKey, provider);

    const gasPrice = await getGasPrice();
    const uniswapRouterAddress = '0xec8b0f7ffe3ae75d7ffab09429e3675bb63503e4';

    const uniswapRouterContract = new ethers.Contract(
      uniswapRouterAddress,
      ['function swapExactETHForTokens(uint256, address[], address, uint256) payable'],
      wallet
    );

    const fromTokenContract = new ethers.Contract(
      fromTokenAddress,
      ['function balanceOf(address) view returns (uint256)'],
      wallet
    );

    const balance = await fromTokenContract.balanceOf(wallet.address);
    const amountIn = balance;
    const path = [fromTokenAddress, toTokenAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60;

    const tx = await uniswapRouterContract.swapExactETHForTokens(
      0,
      path,
      wallet.address,
      deadline,
      { value: amountIn, gasPrice: gasPrice, gasLimit: gasLimit }
    );

    const receipt = await tx.wait();

    console.log('Swap Transaction Receipt:', receipt);
  } catch (error) {
    console.error('Error swapping tokens:', error.message);
  }
}

swapTokens();
