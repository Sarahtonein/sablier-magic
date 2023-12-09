//everything will be tied in here.
//Import and use other modules
// We basically want to loop:
/*
Every 12 hrs we call from claim.js
IF claim is successful, we then call from uniswap.js
IF swap successful, we then call from deposit.js
IF Deposit / balance updates, the withdrawal will be processed
NOTE:
You require gas on nonKYC to be able to withdraw tokens.
This fee is approx $1.8 so it may be worth changing how often these things are called
Estimated total costs is approx $3-5 / 12 hrs. which is approx 2.6% 
*/
