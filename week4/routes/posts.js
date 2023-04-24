const express = require('express');
const Post = require('../models/postModel');
const router = express.Router();

// router.get('/', async function (req, res) {
//   const posts = await Post.find().populate({
//     path: 'user',
//     select: 'name photo',
//   });
//   res.json(posts);
// });

router.get('/', async function (req, res) {
  const timeSort = req.query.timeSort == 'asc' ? 'createAt' : '-createAt';
  const q = req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
  const posts = await Post.find(q)
    .populate({
      path: 'user',
      select: 'name photo',
    })
    .sort(timeSort);
  res.json(posts);
});

router.get('/:id', async function (req, res) {
  const id = req.params.id;
  const post = await Post.findById(id);
  res.json(post);
});

router.post('/', async function (req, res) {
  try {
    const data = req.body;
    if (data.content === undefined) res.status(400).send('欄位未填寫正確或無此 id');

    const newPost = await Post.create({
      name: data.name,
      content: data.content,
      tags: data.tags,
      type: data.type,
      user: data.user,
    });
    res.json(newPost);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.patch('/:id', async function (req, res) {
  try {
    const id = req.params.id;
    const data = req.body;
    const post = await Post.findOneAndUpdate(
      {
        _id: id,
      },
      { $set: { ...data } },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete('/:id', async function (req, res) {
  const id = req.params.id;
  await Post.findByIdAndDelete(id);
  res.status(200).end();
});

module.exports = router;
