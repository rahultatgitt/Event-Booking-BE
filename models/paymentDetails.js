const { timestampFormat } = require("concurrently/src/defaults");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
 
 payment_status: String,
 payment_method: String,
 payment_id: String,
 payment_reference: String,
 payment_date: String,
 payment_amount: String,
 payment_currency: String,
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

module.exports = payment = mongoose.model("ticket", paymentSchema);
