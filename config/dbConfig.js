const mongoose = require('mongoose');
const data = mongoose.connect('mongodb+srv://user:user@cluster0.k2bwu.mongodb.net/sensibull?retryWrites=true&w=majority')
mongoose.connection.on('open', function error(err) {
    if (err) console.log("connection error.!!");
    else console.log("database connected successfully...");

});