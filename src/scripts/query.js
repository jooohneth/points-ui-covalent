import { CovalentClient } from "@covalenthq/client-sdk";

const queryHolders = async (key) => {
  const client = new CovalentClient(key);
  let tempArr = [];

  try {
    for await (const resp of client.BalanceService.getTokenHoldersV2ForTokenAddress(
      "eth-mainnet",
      "0xBd3531dA5CF5857e7CfAA92426877b022e612cf8",
      { pageSize: 1000, blockHeight: 20207567 }
    )) {
      tempArr.push(resp.address);
    }
  } catch (error) {
    console.log(error.message);
  }

  // console.log(tempArr);
  return tempArr.concat([
    "0xCd3B9FeA5E16C847AC9a79653C44DeB1736C165a",
    "0x40FEfD52714f298b9EaD6760753aAA720438D4bB",
  ]);
};

export default queryHolders;
