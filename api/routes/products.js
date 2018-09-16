const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const multer = require('multer');

// const storage = multer.diskStorage({
//     destination : (req , file , cb) => {
//         cb(null , './uploads/');
//     },
//     filename : (req , file , cb) => {
//         cb (null , new Date().toISOString() + file.originalname);
//     }
// }); 

// const fileFilter = (req , file , cb) => {
//     if(file.mimetype === 'images/jpeg' || file.mimetype === 'images/png') {
//         cb(null , true)
//     } else {
//         cb(null ,false);
//     }
// };

// const upload = multer({
//     storage : storage ,
//     // limits : {
//     //     fileSize : 1024 * 1024 * 5
//     // },
//     fileFilter : fileFilter
// });
//model
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product
        .find()
        .select("name _id price")
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                products: result.map(result => {
                    return {
                        name: result.name,
                        price: result.price,
                        _id: result._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + result._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                Error: {
                    message: err
                }
            });
        });
});

router.post('/', /*upload.single('productImage') ,*/ (req, res, next) => {
    
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
       // productImage : req.file.path
    });
    product
        .save()
        .then(result => {
            res.status(201).json({
                message: "Product Successfully Added.",
                Details: {
                    name: result.name,
                    price: result.price,
                    id: result._id,
                },
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/products/" + result._id
                }
            });
        }).catch(err => {
        res.status(500).json({
            Error: {
                message: err
            }
        });
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select("name price _id")
        .exec()
        .then(result => {
        if (result == null) {
            res.status(404).json({
                Error: {
                    message: "No record Found"
                }
            });
        } else {
            res.status(200).json({
                message: "Product Found.",
                Details: result
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            Error: {
                message: err
            }
        });
    });
});


router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    ;
    Product.update({_id: id}, {$set: updateOps})
        .exec()
        .then(() => {
            res.status(200).json({
                message: "Product Updated.",
                Request: {
                    type : 'GET',
                    url : "http://localhost:3000/products/" + id
                }
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

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.remove({_id: id})
        .exec()
        .then(() => {
            res.status(200).json({
                message: "Product Deleted.",
                POST: {
                    type : 'POST',
                    url : "http://localhost:3000/products/",
                    data : {
                        name : 'string',
                        price : "number"
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Error: {
                    message: err
                }
            });
        });
});

module.exports = router;
