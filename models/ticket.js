const { timestampFormat } = require("concurrently/src/defaults");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
 user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userAuth'
 },
 concert_name: String,
 concert_date: String,
 ticket_number: String,
 ticket_price: String,
 status: String,
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

module.exports = ticket = mongoose.model("ticket", ticketSchema);
