const dotenv = require('dotenv');
const { ethers } = require('ethers');
const masterContractABI = require('../../out/CrowdFundingMaster.sol/CrowdFundingMaster.json').abi;
dotenv.config();

const BASE_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL; 
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MASTER_CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const masterContract = new ethers.Contract(
    MASTER_CONTRACT_ADDRESS, 
    masterContractABI,
     wallet
);

module.exports = {
    provider, wallet, masterContract
}