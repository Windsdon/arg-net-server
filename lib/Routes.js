'use strict';

const router = require('express').Router();

router.use(require('./routes/tasks.js'));
router.use(require('./routes/workers.js'));

module.exports = router;