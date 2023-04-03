const http = require('http');
const mongoose = require('mongoose');
const headers = require('./headers');
const handleSuccess = require('./handleSuccess');
const handleError = require('./handleError');
const Post = require('./model/post');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(db).then(() => console.log('DB connect success'));

const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url === '/posts' && req.method === 'GET') {
    const post = await Post.find();
    handleSuccess(res, post);
  } else if (req.url.startsWith('/posts/') && req.method === 'GET') {
    const id = req.url.split('/').pop();
    const post = await Post.find({
      _id: id,
    });
    handleSuccess(res, post);
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.on('end', async () => {
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
    });
  } else if (req.url.startsWith('/posts/') && req.method === 'PATCH') {
    req.on('end', async () => {
      try {
        const id = req.url.split('/').pop();
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
    });
  } else if (req.url.startsWith('/posts/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    await Post.findByIdAndDelete(id);

    handleSuccess(res, null);
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'false',
        message: '無此網站路由',
      })
    );
    res.end();
  }
};
const server = http.createServer(requestListener);
server.listen(3000);
