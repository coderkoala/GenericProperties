'use strict';

var express = require('express');
var router = express.Router();

// Import controllers.
const requireDir = require('require-dir');
const _ = requireDir('../controller');
const api = '/api/v1';

/* Backend for the system. */
router.get(`${api}/dynamics`, _.api.view);
router.post(`${api}/dynamics`, _.api.post);

module.exports = router;
