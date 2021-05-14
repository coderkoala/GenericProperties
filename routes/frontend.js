'use strict';

const express = require('express');
const router = express.Router();

// Home controller.
const requireDir = require('require-dir');
const _ = requireDir('../controller');

// Homepage Controller.
router.get('/', _.frontend.view);

// Geolocation Controller.
router.get('/geolocation', _.geolocation.view);
router.post('/geolocation', _.geolocation.post);

// Terms Controller.
router.get('/terms', _.terms.view);

module.exports = router;
