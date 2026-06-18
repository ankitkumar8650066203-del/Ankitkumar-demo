const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const Groq = require("groq-sdk");

const ImageScan =
require("../models/ImageScan");

const router = express.Router();

const groq = new Groq({
apiKey:process.env.GROQ_API_KEY
});

const storage =
multer.diskStorage({

destination:(req,file,cb)=>{
cb(null,"uploads/");
},

filename:(req,file,cb)=>{
cb(
null,
Date.now()+"-"+file.originalname
);
}

});

const upload =
multer({storage});

router.post(
"/scan-image",
upload.single("image"),
async(req,res)=>{

try{

const ocr =
await Tesseract.recognize(
req.file.path,
"eng"
);

const text =
ocr.data.text;

const prompt = `
You are an expert Job Scam Detector.

Analyze this screenshot text.

Return ONLY JSON:

{
"result":"",
"riskScore":0,
"reasons":[]
}

Text:

${text}
`;

const ai =
await groq.chat.completions.create({

messages:[
{
role:"user",
content:prompt
}
],

model:"llama-3.3-70b-versatile"

});

const response =
ai.choices[0].message.content;

const parsed =
JSON.parse(response);

await ImageScan.create({

imageName:req.file.originalname,

extractedText:text,

result:parsed.result,

riskScore:parsed.riskScore,

reasons:parsed.reasons

});

res.json({

image:req.file.originalname,

text,

...parsed

});

}catch(error){

console.log(error);

res.status(500).json({
message:error.message
});

}

});

module.exports = router;