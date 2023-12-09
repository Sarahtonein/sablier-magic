require('dotenv').config();
const { ethers } = require('ethers');

/*TODO: 
1. Swap token for based token (we will use eth)
2. Deposit to nonkyc.io
3. Swap on nonky.io
4. Withdraw to new address

Nice to have:
randomizing of withdraw amnts, say over multiple TX
XMR swapping + unique wallet generation

*/
const privateKey = process.env.PRIVATE_KEY;
const streamId = "211";
const receiverAddress = "0x8bb542f597d10a69bc6ba28942e2378fec5137a9";

if (!privateKey || !streamId || !receiverAddress) {
  console.error('Provide required env vars before running this script.');
  process.exit(1);
}

const provider = new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
const wallet = new ethers.Wallet(privateKey, provider);

let totalAmountWithdrawn;

async function getGasPrice() {
  try {
    const gasPrice = await provider.getGasPrice();
    return gasPrice;
  } catch (error) {
    console.error('Error getting gas price:', error.message);
    throw error;
  }
}

async function withdrawMaxFromStream() {
  try {
    const abi = ['function withdrawMax(uint256 streamId, address to) external'];
    const sablier = new ethers.Contract('0x197D655F3be03903fD25e7828c3534504bfe525e', abi, wallet);

    // Dynamically fetch gas price
    const gasPrice = await getGasPrice();

    const tx = await sablier.withdrawMax(streamId, receiverAddress, { gasPrice });
    await tx.wait();

    // Assume the token has 18 decimals, adjust accordingly
    const tokenWithdrawn = ethers.utils.formatUnits(tx.value, 18);

    // Update total amount withdrawn
    totalAmountWithdrawn += parseFloat(tokenWithdrawn);

    console.log(`Withdrawal successful! Amount: ${tokenWithdrawn} tokens | Total: ${totalAmountWithdrawn} tokens`);
  } catch (error) {
    console.error('Error withdrawing max from stream:', error.message);
  }
}

// Run the function every 12 hours
setInterval(withdrawMaxFromStream, 12 * 60 * 60 * 1000);
