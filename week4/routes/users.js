var express = require('express');
var router = express.Router();
const User = require('../models/userModel');

router.get('/', async function (req, res) {
  const users = await User.find();
  res.json(users);
});

router.get('/:id', async function (req, res) {
  const user = await User.find({ _id: req.params.id });
  res.json(user);
});

module.exports = router;
