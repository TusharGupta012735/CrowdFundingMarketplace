const { masterContract } = require("./ethers.js");
require("dotenv").config();

async function main() {
  try {
    const campaigns = await masterContract.getCampaigns();
    console.log("Campaigns:", campaigns);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
