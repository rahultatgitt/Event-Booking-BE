const { timestampFormat } = require("concurrently/src/defaults");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username:{
    type:String,
    required:true,
    unique:true,
    minlength:6
  },
  password:{
    type:String,
    required:true,
    minlength:6,
    
  },
  user_type:String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
  
})

// Create Schema

module.exports = User = mongoose.model("user", userSchema);
