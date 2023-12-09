require('dotenv').config();
const { ethers } = require('ethers');
const { getGasPrice } = require('./gas.js');

const privateKey = process.env.PRIVATE_KEY;
const exchangeAddress = process.env.NON_KYC_EXCHANGE_ADDRESS;
const depositTokenAddress = process.env.DEPOSIT_TOKEN_ADDRESS;

if (!privateKey || !exchangeAddress) {
  console.error('Provide required env vars before running this script.');
  process.exit(1);
}

async function depositToExchange() {
  try {
    // Connect to the Arb network
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Get the current balance of the wallet
    const balance = await wallet.getBalance();

    // Calculate 80% of the balance
    const amount = balance.mul(8).div(10); // 80% of the balance

    // ERC-20 token contract instance
    const tokenContract = new ethers.Contract(depositTokenAddress, ['function transfer(address to, uint256 amount)'], wallet);

    // Get the gas price
    const gasPrice = await getGasPrice();

    // Construct the transaction with gas price
    const tx = await tokenContract.transfer(exchangeAddress, amount, { gasPrice });

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    console.log('Transaction receipt:', receipt);
    console.log('Token deposit tx successful!');
  } catch (error) {
    console.error('Error depositing tokens:', error);
  }
}

depositToExchange();
