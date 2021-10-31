const app = require('../src/app');

process.env.PORT = process.env.PORT || 8080;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const CONSOLE_COLOR_GREEN = '\x1b[32m%s\x1b[0m';

function setupServer() {
  app.listen(process.env.PORT, () => {
    console.log(CONSOLE_COLOR_GREEN, `\nListening on PORT: ${process.env.PORT} and Env: ${process.env.NODE_ENV}\n`);
  });

  // module.exports = app;
}

setupServer();