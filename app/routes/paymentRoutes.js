// paymentRoutes.js
const express = require('express');
const createPreferenceMiddleware = require('../middlewares/mercadoPagoIntegration');

const router = express.Router();

router.get('/create', createPreferenceMiddleware, (req, res) => {
  res.json(req.mercadoPagoPreference);
});

module.exports = router;
