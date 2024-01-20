const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require('../middleware');
const User = require('../models/user');
const Task = require('../models/task');

router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const query = req.query.target || 'newTask';
    const user = await User.find(req.user);
    const tasks = await Task.find({ user }).populate('user');
    res.render('task/index', { query, tasks })
}));


router.post('/', isLoggedIn, catchAsync(async (req, res) => {
    const user = await User.findOne({ username: req.user.username });
    const { task, topic, description } = req.body;
    const newTask = new Task({ task, topic, description, user });
    await newTask.save();
    res.redirect('/tasks');
}));

router.delete('/', isLoggedIn, catchAsync(async (req, res) => {
    const { task } = req.body;
    const deletedTask = await Task.findOneAndDelete({ task });
    res.redirect('/tasks?target=tasks');
}));

module.exports = router;