const {headerAuth} = require('../auth/headerAuth');
module.exports = app => {
    const router = require('express').Router();
    const orderController = require('../controller/orderController');

    // This endpoint perform post operation
    router.post("/order-service",headerAuth, orderController.placeOrder);

    // This endpoint perform Get operation
    router.get("/order-service", orderController.getOrders);

    // This endpoint perform Update operation
    router.put("/order-service", orderController.modifyOrder);

    // This endpoint perform Delete operation
    router.delete("/order-service/:id", orderController.cancelOrder);

    app.use('', router);

}