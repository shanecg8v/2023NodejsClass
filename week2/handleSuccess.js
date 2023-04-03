const headers = require('./headers');

const handleSuccess = (res, data) => {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      status: 'success',
      data: data,
    })
  );
  res.end();
};

module.exports = handleSuccess;
