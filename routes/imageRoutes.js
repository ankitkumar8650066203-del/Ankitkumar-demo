const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");

const router = express.Router();

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, "uploads/");

  },

  filename: function (req, file, cb) {

    cb(
      null,
      Date.now() + "-" + file.originalname
    );

  }

});

const upload = multer({
  storage
});

router.post(
  "/scan-image",
  upload.single("image"),
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          message: "Image Required"
        });

      }

      const result =
        await Tesseract.recognize(
          req.file.path,
          "eng"
        );

      const extractedText =
        result.data.text;

      let riskScore = 10;

      let reasons = [];

      const text =
        extractedText.toLowerCase();

      if (
        text.includes("telegram")
      ) {

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
        text.includes("earn")
      ) {

        reasons.push(
          "Unrealistic earning claim"
        );

        riskScore += 15;

      }

      if (
        text.includes("investment")
      ) {

        reasons.push(
          "Investment requested"
        );

        riskScore += 20;

      }

      let resultText =
        "Safe Job";

      if (
        riskScore >= 50
      ) {

        resultText =
          "Potential Scam";

      }

      res.json({

        extractedText,

        result:
          resultText,

        riskScore,

        reasons

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

  }
);

module.exports = router;