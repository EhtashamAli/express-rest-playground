const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');


router.get('/', (req, res, next) => {
    Order.find()
        .select("_id productId qty")
        .exec()
        .then(result => {
            res.status(200).json({
                count: result.length,
                Orders: result.map(result => {
                    return {
                        _id: result._id,
                        productId: result.productId,
                        qty: result.qty,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + result._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                Error: {
                    message: err
                }
            });
        });
});

router.post('/', (req, res, next) => {
    const order = new Order( {
        _id : new mongoose.Types.ObjectId(),
        productId: req.body.productId,
        qty: req.body.qty
    });
    order
    .save()
    .then(result => {
        res.status(200).json({
            order : {
                id : result._id,
                productId : result.productId,
                qty : result.qty
            },
            message : "Order Added"
        });
    })
    .catch(err => {
        res.status(500).json({
            errMessage : err
        });
    });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .select("_id productId qty")
        .exec()
        .then(result => {
            if (result == null) {
                res.status(404).json({
                    message: "Order Id Not Found"
                });
            } else {
                res.status(200).json({
                    message: "Order Id Found",
                    Order: result,
                    Request: {
                        Type: "GET",
                        URL: "http://localhost:3000/orders/"
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                Error: {
                    message: err
                }
            });
        });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'delete on orderId',
        id: req.params.orderId
    });
});

module.exports = router;
