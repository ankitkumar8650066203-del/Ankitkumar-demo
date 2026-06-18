const express = require("express");
const ScanHistory = require("../models/ScanHistory");

const router = express.Router();

router.post("/scan", async (req, res) => {

  try {

    const { jobText } = req.body;

    if (!jobText) {

      return res.status(400).json({
        message: "Job description required"
      });

    }

    let result = "Safe Job";
    let riskScore = 10;
    let reasons = [];

    const text = jobText.toLowerCase();

    if (text.includes("telegram")) {

      reasons.push(
        "Telegram contact detected"
      );

      riskScore += 25;

    }

    if (
      text.includes(
        "registration fee"
      )
    ) {

      reasons.push(
        "Registration fee requested"
      );

      riskScore += 35;

    }

    if (
      text.includes(
        "investment"
      )
    ) {

      reasons.push(
        "Investment requested"
      );

      riskScore += 20;

    }

    if (
      text.includes(
        "earn"
      )
    ) {

      reasons.push(
        "Unrealistic earning claims"
      );

      riskScore += 15;

    }

    if (riskScore >= 50) {

      result =
        "Potential Scam";

    }

    const aiResponse = `
Result: ${result}

Risk Score: ${riskScore}

Reasons:
${
  reasons.length
  ?
  reasons.map(
    r => "- " + r
  ).join("\n")
  :
  "- No suspicious keywords found"
}
`;

    await ScanHistory.create({

      jobText,

      result: aiResponse,

      riskScore

    });

    res.json({

      result: aiResponse,

      riskScore

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

/* HISTORY */

router.get(
"/history",
async(req,res)=>{

try{

const history =
await ScanHistory.find()
.sort({
createdAt:-1
});

res.json(history);

}catch(error){

res.status(500).json({
message:error.message
});

}

});

/* STATS */

router.get(
"/stats",
async(req,res)=>{

try{

const scans =
await ScanHistory.find();

const totalScans =
scans.length;

const scamJobs =
scans.filter(
s=>s.riskScore >= 50
).length;

const safeJobs =
scans.filter(
s=>s.riskScore < 50
).length;

res.json({

totalScans,

safeJobs,

scamJobs

});

}catch(error){

res.status(500).json({
message:error.message
});

}

});

module.exports = router;