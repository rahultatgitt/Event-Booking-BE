const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authschema = new Schema({
  auth_id: String,
  auth_level: String,
  expiry: Date,
})

// Create Schema
const UserSchema = new Schema({
  user_type: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    // required: true,
    min: 10,
    max: 13
  },
  password: String,

  unsubmit_password: String,

  group: String,
  // password: {
  //   type: String,
  //   required: true,
  //   min: 6
  // },
  name: {
    type: String,
    // required: true,
  },





  country: String,
  country_code: String,





  authorizations: {
    policies: [authschema],
    polsubs: [authschema],
    claim_histories: [authschema],
    incidents: [authschema],
    claims: [authschema],
    eobs: [authschema],
  },


  queues: [{

    queue_id: String,
    added_by: String,
    added_at: Date,

  }],

  roles: [{
    role_id: String,
    added_by: String,
    added_at: Date,
  }],


  PPN_id: String,
  PPN_name: String,


  profile_pic: {
    type: Object
  },
  id_proof_type: {
    type: String
  },
  id_front_page: {
    type: Object,
  },
  id_back_page: {
    type: Object,
  },
  email: {
    type: String
  },
  // rating: {
  //   type: Number
  // },
  // total_credits: {
  //   type: Number
  // },
  is_active: {
    type: Number,
    required: true,
    default: 0
  },
  confirmOtp: {
    type: String,
    // required: true,
  },
  otpTries: {
    type: String,
    default: null
  },
  acceptTOS: {
    type: String,
    // required: true,
    default: null
  },
  acceptPP: {
    type: String,
    // required: true,
    default: null
  },
  video_watched: {
    type: String,
    // required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now
  }

});

module.exports = User = mongoose.model("users", UserSchema);
