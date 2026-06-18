const mongoose = require("mongoose");

const resumeMatchSchema =
new mongoose.Schema({

  jobText:String,

  matchScore:Number,

  matchedSkills:[String],

  missingSkills:[String],

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports =
mongoose.model(
  "ResumeMatch",
  resumeMatchSchema
);