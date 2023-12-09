//This code is used to deposit / withdraw from nonkyc
//as well as performing additional swaps

//Ticker ETH-ARBITRUM
//Ticker USDT-ARB20
//https://nonkyc.io/api/v2/balances
///createorder
/*{
  "userProvidedId": "string",
  "symbol": "string",
  "side": "sell",
  "type": "limit",
  "quantity": "string",
  "price": "string",
  "strictValidate": false
}*/
//USDT,Tether USDT,0.01679526,0.00000000,0.00000000,64367cb8fff6d79a1a316869


import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const API_KEY = process.env.NON_KYC_API_KEY;
const API_SECRET = process.env.NON_KYC_API_SECRET;
const FINAL_DESTINATION_ADDRESS = process.env.FINAL_DESTINATION_ADDRESS;
const apiUrl = 'https://nonkyc.io/api/v2/balances';

const basicAuthHeader = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

// Function to check balance and initiate withdrawal
function checkBalanceAndWithdraw() {
  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${basicAuthHeader}`,
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(balances => {
      // Find and log the balance of USDT
      const usdtBalance = balances.find(balance => balance.asset === 'USDT');

      if (usdtBalance) {
        console.log('USDT Balance Information:');
        console.log('Asset:', usdtBalance.asset);
        console.log('Name:', usdtBalance.name);
        console.log('Available:', usdtBalance.available);
        console.log('Pending:', usdtBalance.pending);
        console.log('Held:', usdtBalance.held);
        console.log('AssetID:', usdtBalance.assetid);

        // Check conditions for withdrawal
        const availableBalance = parseFloat(usdtBalance.available);
        const pendingBalance = parseFloat(usdtBalance.pending);

        if (availableBalance > 10 && pendingBalance === 0) {
          console.log('Withdrawal conditions met. Initiating withdrawal...');

          // Initiate withdrawal
          initiateWithdrawal(availableBalance);
        } else {
          console.log('Withdrawal conditions not met.');
        }
      } else {
        console.log('USDT Balance not found.');
      }
    })
    .catch(error => {
      console.error('Error fetching balances:', error.message);
    });
}

// Function to initiate withdrawal
function initiateWithdrawal(quantity) {
  const withdrawalApiUrl = 'https://nonkyc.io/api/v2/createwithdrawal';

  fetch(withdrawalApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${basicAuthHeader}`,
    },
    body: JSON.stringify({
      ticker: 'USDT',
      quantity: quantity.toString(),
      address: FINAL_DESTINATION_ADDRESS,
      paymentid: '', // Leave empty if not applicable
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(withdrawalResponse => {
      console.log('Withdrawal Request:', withdrawalResponse);
      if (withdrawalResponse.issent && withdrawalResponse.isconfirmed) {
        console.log('Withdrawal successful!');
      } else {
        console.log('Withdrawal request sent but not confirmed yet.');
      }
    })
    .catch(error => {
      console.error('Error creating withdrawal request:', error.message);
    });
}

// Check balance and initiate withdrawal every 5 minutes
setInterval(checkBalanceAndWithdraw, 5 * 60 * 1000);
