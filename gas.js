require('dotenv').config();
const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER);

async function getGasPrice() {
  try {
    const gasPrice = await provider.getGasPrice();
    return gasPrice;
  } catch (error) {
    console.error('Error getting gas price:', error.message);
    throw error;
  }
}

// Export function
module.exports = {
  getGasPrice,
};
