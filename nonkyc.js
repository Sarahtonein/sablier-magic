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

require('dotenv').config();

const API_KEY = process.env.NON_KYC_API_SECRET;
const apiUrl = 'https://nonkyc.io/api/v2/asset/getlist';

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Assuming the response is an array
    data.forEach(asset => {
      const ticker = asset.ticker;
      console.log('Ticker:', ticker);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
