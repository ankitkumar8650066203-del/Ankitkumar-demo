const express = require("express");

const ScanHistory =
require("../models/ScanHistory");

const router = express.Router();

router.post("/scan", async (req,res)=>{

  try{

    const { jobText } = req.body;

    let result = "Safe Job";
    let riskScore = 10;

    const text =
    jobText.toLowerCase();

    if(
      text.includes("registration fee") ||
      text.includes("pay fee") ||
      text.includes("deposit money")
    ){
      result = "Scam Job";
      riskScore = 90;
    }

    await ScanHistory.create({

      jobText,
      result,
      riskScore

    });

    res.json({

      result,
      riskScore

    });

  }
  catch(error){

    res.status(500).json({

      message:error.message

    });

  }

});

router.get(
  "/history",
  async(req,res)=>{

    const history =
    await ScanHistory.find()
    .sort({createdAt:-1});

    res.json(history);

});

module.exports = router;