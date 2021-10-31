const { MenuController } = require('../controller/index');

const menuController = new MenuController();

module.exports = (app) => {
  
  // CRUDL

  app.route('/api/v1/menus').get(menuController.list.bind(menuController));

  app.route('/api/v1/menus').post(menuController.create.bind(menuController));

  app.route('/api/v1/menus/:id').get(menuController.getById.bind(menuController));

  app.route('/api/v1/menus/:id').put(menuController.update.bind(menuController));

  app.route('/api/v1/menus/:id').delete(menuController.deleteById.bind(menuController));

  // Get the created Menu and submenus

  app.route('/api/v1/menu').get(menuController.getMenu.bind(menuController));

};
