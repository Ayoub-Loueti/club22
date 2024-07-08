const express = require('express');
const { Add, Verify } = require('../controllers/PaymentController');
const Router = express.Router();

Router.post('/payment', Add);
Router.post('/payment/:id', Verify);

module.exports = Router;
