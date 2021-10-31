const { MenuController } = require('../controller/index');

const menuController = new MenuController();

module.exports = (app) => {
  app.route('/v1/menu/:id').get(menuController.getById.bind(menuController));
};
