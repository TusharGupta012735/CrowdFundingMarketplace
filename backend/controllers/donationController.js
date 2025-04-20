const { masterContract } = require("../lib/ethers.js");
const { ethers } = require("ethers"); // ensure ethers v6 is used

const donateCampaign = async (req, res) => {
  const {id, value} = req.body;
  if (!id || !value) {
    return res.status(400).json({ message: "Campaign ID and value are required" });
  }
  try{
    const tx = await masterContract.donateToCampaign(id, {
      value: ethers.parseUnits(value.toString(), "ether"),
    });
    await tx.wait();
    return res.status(200).json({
      message: "Donation successful",
      transactionHash: tx.hash,
    });
  } catch(error){
    console.error("Error donating to campaign:", error);
    return res.status(500).json({ message: "Server error", error: error.reason || error.message });
  }
};

const createCampaign = async (req, res) => {
  const { title, description, target, deadline } = req.body;

  // Basic input validation
  if (!title || !description || !target || !deadline) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {

    const sanitizedTarget = target.toString().trim();
    const sanitizedDeadline = deadline.toString().trim();

    const targetInWei = ethers.parseUnits(sanitizedTarget, "ether");

    // Convert deadline to UNIX timestamp
    const deadlineTimestamp = Number(sanitizedDeadline);

    if (
      isNaN(deadlineTimestamp) ||
      deadlineTimestamp <= Math.floor(Date.now() / 1000)
    ) {
      return res
        .status(400)
        .json({ message: "Deadline must be a valid future timestamp" });
    }

    // Call the contract
    const tx = await masterContract.createCampaign(
      title,
      description,
      targetInWei,
      deadlineTimestamp
    );

    await tx.wait();

    return res.status(200).json({
      message: "Campaign created successfully",
      transactionHash: tx.hash,
    });
  } catch (err) {
    console.error("Error creating campaign:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.reason || err.message });
  }
};

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await masterContract.getCampaigns();
    const formattedCampaigns = campaigns.map((campaign) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: campaign.target.toString(),
      deadline: new Date(Number(campaign.deadline) * 1000).toISOString(),
      amountCollected: campaign.amountCollected.toString(),
      donators: campaign.donators,
      donations: campaign.donations.map((d) => d.toString()),
    }));

    console.log(formattedCampaigns);

    res.json(formattedCampaigns);
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};


const getDonators = async (req, res) => {
  const {id} = req.body;
  if(!id){
    return res.status(400).json({ message: "Campaign ID is required" });
  }
  const tx = await masterContract.getDonators(id);
  const [ donators, idDonators] = tx;
  console.log(donators, idDonators);
  const formattedDonators = donators.map((donator, index) => ({
    donator: donator,
    idDonator: idDonators[index].toString(),
  }));
  res.status(200).json({
    message: "Donators fetched successfully",
    donators: formattedDonators,
  });
};

module.exports = {
  donateCampaign,
  createCampaign,
  getCampaigns,
  getDonators,
};
