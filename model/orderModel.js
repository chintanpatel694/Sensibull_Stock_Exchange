const mongoose = require('mongoose');

const orderModel = new mongoose.Schema({
    identifier: { type: String, unique: true },
    symbol: { type: String },
    quantity: { type: Number },
    filled_quantity: { type: Number },
    order_status: { type: String }
})

module.exports = mongoose.model('order', orderModel);