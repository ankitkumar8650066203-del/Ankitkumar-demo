const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const ResumeMatch =
require("../models/ResumeMatch");

const router = express.Router();

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

const skillsList = [

"html",
"css",
"javascript",
"react",
"node",
"express",
"mongodb",
"mysql",
"python",
"java",
"c++",
"github",
"bootstrap"

];

router.post(
"/compare",
upload.single("resume"),
async(req,res)=>{

try{

const { jobText } = req.body;

const dataBuffer =
fs.readFileSync(req.file.path);

const pdfData =
await pdfParse(dataBuffer);

const resumeText =
pdfData.text.toLowerCase();

const job =
jobText.toLowerCase();

let matchedSkills = [];
let missingSkills = [];

skillsList.forEach(skill=>{

const inResume =
resumeText.includes(skill);

const inJob =
job.includes(skill);

if(inJob && inResume){

matchedSkills.push(skill);

}

if(inJob && !inResume){

missingSkills.push(skill);

}

});

let matchScore = 0;

if(
matchedSkills.length +
missingSkills.length
> 0
){

matchScore =
Math.round(

(
matchedSkills.length /

(
matchedSkills.length +
missingSkills.length
)

)*100

);

}

await ResumeMatch.create({

jobText,

matchScore,

matchedSkills,

missingSkills

});

res.json({

matchScore,

matchedSkills,

missingSkills

});

}catch(error){

console.log(error);

res.status(500).json({

message:error.message

});

}

});

module.exports = router;