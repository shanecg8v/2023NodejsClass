const routes = require('./routes');
require('./connections/index');

const app = async (req, res) => {
  routes(req, res);
};

module.exports = app;
