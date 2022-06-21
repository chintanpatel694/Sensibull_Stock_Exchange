const { ObjectId } = require("mongodb")

let response = (success, payload) => {
    let resp = {
        success: success,
        payload: payload
    }
    return resp
}

let responseData = (success, payload,statusCode,msg) => {
    let data = {
        success: success,
        payload,
        statusCode:statusCode,
        msg
    }
    return data
}

let saveResponse = (order_id, symbol, request_quantity, filled_quantity, status) => {

    let data = {

        identifier: order_id,
        symbol: symbol,
        quantity: request_quantity,
        filled_quantity: filled_quantity,
        order_status: status
    }
    return data
}

let errorMessage = (status, err_msg) => {

    let data = {
        status: status,
        err_msg: err_msg
    }
    return data
}

module.exports = { response, responseData, saveResponse, errorMessage }
