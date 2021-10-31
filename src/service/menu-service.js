const Menu = require('../domain/model/menu-model');

class MenuService {

  getById() {
    return Menu.count();
  }

}

module.exports = MenuService;