const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');
const Post = require('../model/post');

const posts = {
  async getPosts({ req, res }) {
    const post = await Post.find();
    handleSuccess(res, post);
  },
  async getPost({ req, res }) {
    const id = req.url.split('/').pop();
    const post = await Post.find({
      _id: id,
    });
    handleSuccess(res, post);
  },
  async createPost({ req, res, body }) {
    try {
      const data = JSON.parse(body);

      if (data.content === undefined) {
        handleError(res, null);
      }

      const newPost = await Post.create({
        name: data.name,
        content: data.content,
        tags: data.tags,
        type: data.type,
      });

      handleSuccess(res, newPost);
    } catch (error) {
      handleError(res, error);
    }
  },
  async updatePost({ req, res, body }) {
    try {
      const id = url.split('/').pop();
      const data = JSON.parse(body);
      const post = await Post.findOneAndUpdate(
        {
          _id: id,
        },
        { $set: { ...data } },
        { new: true }
      );
      handleSuccess(res, post);
    } catch (error) {
      handleError(res, error);
    }
  },
  async deletePost({ req, res }) {
    const id = req.url.split('/').pop();
    await Post.findByIdAndDelete(id);

    handleSuccess(res, null);
  },
};

module.exports = posts;
