const orderModel = require('../model/orderModel');
const response = require('../response/response');
const axios = require('axios');
const cron = require('node-cron');

const header = {
    headers: { "X-AUTH-TOKEN": "qwertyuoiutsd" }
}

//********************************* Create Cron Shedular to update record *********************************

cron.schedule("*/5 * * * * *", async function () {
    try {
        const findData = await orderModel.find({ order_status: "open" })
        for (let ele of findData) {

            axios.post('https://prototype.sbulltech.com/api/order/status-for-ids', { "order_ids": [ele.identifier] }, header)
                .then(async (result) => {
                    console.log(result.data.payload[0].status);
                    const data = await orderModel.updateOne(
                        { "identifier": ele.identifier },
                        {
                            $set: { 'order_status': result.data.payload[0].status,'filled_quantity': result.data.payload[0].filled_quantity}
                        }
                    )
                    console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
    catch (err) {
        console.log(err);
        resp.status(500).send({ message: err.message || "something went wrong please try again.." })

    }
});


//********************************* get all orders *********************************


exports.getOrders = async (req, resp) => {

    try {
        const data = await orderModel.find({})
        resp.send(data);
    }
    catch (err) {
        console.log(err);
        resp.status(500).send({ message: err.message || "something went wrong please try again..." })
    }
}

//********************************* PlaceOrder Api *********************************


exports.placeOrder = async (req, resp) => {
    try {
        let header = {
            headers: { "X-AUTH-TOKEN": req.headers.authorization }
        }
        let responseData
        await axios.post('https://prototype.sbulltech.com/api/order/place', req.body, header)

            .then(async (result) => {
                console.log(result.data);
                responseData = await response.responseData(
                    true,
                    result.data.payload.order,
                    200,
                    "order place successfully "

                )
                console.log(responseData);
                const saveResponse = response.saveResponse(
                    result.data.payload.order.order_id,
                    result.data.payload.order.symbol,
                    result.data.payload.order.request_quantity,
                    result.data.payload.order.filled_quantity,
                    result.data.payload.order.status
                )
                const data = new orderModel(saveResponse);
                const orderSave = await data.save();
                await resp.send(responseData);

            })
            .catch(async (err) => {
                responseData = await response.responseData(
                    false,
                    {},
                    500,
                    "something went wrong please try again.."
                )
                resp.send(responseData);
            });
    }
    catch (err) {
        console.log(err);
        resp.send({ message: err.message || "something went wrong please try again.." });
    }
}


// ********************************* modifyOrder API *********************************


exports.modifyOrder = async (req, resp) => {


    try {
        let responseData
        const checkStatus = await orderModel.findOne({ "identifier": req.body.identifier })
        if (checkStatus.order_status === 'complete') {
            responseData = await response.responseData(
                false,
                {},
                500,
                "sorry only open orders can be modify"
            )
           
        }
        else if (checkStatus.order_status === 'error') {
            responseData = await response.responseData(
                false,
                {},
                500,
                "'sorry' only open orders can be modify"
            )
          
        }
        else if(checkStatus.filled_quantity > req.body.quantity){
            responseData = await response.responseData(
                false,
                {},
                500,
                "please provide quantity should be greater than filled quantity "
            )
        }
        else {

        let header = {
            headers: { "X-AUTH-TOKEN": req.headers.authorization }
        }

        await axios.put('https://prototype.sbulltech.com/api/order/place/' + req.body.identifier, { "quantity": req.body.quantity }, header)
            .then(async (result) => {



                responseData = await response.responseData(
                    true,
                    result.data.payload.order,
                    200,
                    "order modify successfully "

                )
                console.log(responseData);
                const data = await orderModel.updateOne(

                    { "identifier": req.body.identifier },
                    {
                        $set: { 'quantity': req.body.quantity }
                    }
        
                )

            })
            .catch(async (err) => {
                responseData = await response.responseData(
                    false,
                    {},
                    500,
                    "something went wrong please try again"

                )
                console.log(err);
            })
        }
        await resp.send(responseData);


    } catch (err) {
        console.log(err);
        resp.send({ message: err.message || "something went wrong please try again.." });
    }

}


//********************************* cancelOrder API  *********************************


exports.cancelOrder = async (req, resp) => {

    try {
        let responseData
        const checkStatus = await orderModel.findOne({ "identifier": req.params.id })
        
        if (checkStatus.order_status === 'complete') {
            responseData = await response.responseData(
                false,
                {},
                500,
                "sorry only open orders can be cancelled"
            )
           
        }
        else if (checkStatus.order_status === 'error') {
            responseData = await response.responseData(
                false,
                {},
                500,
                "sorry only open orders can be cancelled"
            )
          

        }
        else {
            let header = {
                headers: { "X-AUTH-TOKEN": req.headers.authorization }
            }

            
            await axios.delete('https://prototype.sbulltech.com/api/order/place/' + req.params.id, header)
                .then(async (result) => {

                    responseData = await response.responseData(
                        true,
                        result.data.payload.order,
                        200,
                        "order cancle successfully "
                    )
                    const data = await orderModel.deleteOne({ "identifier": req.params.id })

                })
                .catch(async (err) => {
                    responseData = await response.responseData(
                        false,
                        {},
                        500,
                        "something went wrong please try again.."
                    )
                    console.log(err);
                })           
        }
        await resp.send(responseData);
        
    }
    catch (err) {
        resp.send({ message: err.message || "something went wrong please try again.." });
    }
}




