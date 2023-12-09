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

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const API_KEY = process.env.NON_KYC_API_KEY;
const API_SECRET = process.env.NON_KYC_API_SECRET;
const apiUrl = 'https://nonkyc.io/api/v2/getdeposits';

const basicAuthHeader = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

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
  .then(deposits => {
    console.log('List of deposits:', deposits);
    // You can now work with the 'deposits' array as needed
  })
  .catch(error => {
    console.error('Error fetching deposits:', error.message);
  });
