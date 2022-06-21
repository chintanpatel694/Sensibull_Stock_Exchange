const express = require('express');
require('./config/dbConfig.js');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

require('./router/orderRouter')(app);



app.listen(4000, () => {
    console.log("your server run is 4000 port..");
})