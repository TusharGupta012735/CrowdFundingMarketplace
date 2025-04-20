const express = require("express");
const { donateCampaign, createCampaign, getCampaigns, getDonators} = require("../controllers/donationController");

const router = express.Router();

router.post("/donate", donateCampaign);
router.post("/create", createCampaign);
router.get("/campaigns", getCampaigns);
router.get("/donators", getDonators);

module.exports = router; 