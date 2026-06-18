const mongoose = require("mongoose");

const imageScanSchema = new mongoose.Schema({

  imageName:String,

  extractedText:String,

  result:String,

  riskScore:Number,

  reasons:[String],

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports =
mongoose.model(
"ImageScan",
imageScanSchema
);