const Menu = require('../domain/model/menu-model');
const MenuTreeItem = require('../domain/schema/menu-tree-item');
const { isSameObjectId } = require('../utils/mongoose-utils');

class MenuStructureService {

  async getMenuTree() {
    const allMenus = await this.#getAllMenus();
    const rootMenus = [];
    
    const remainingMenus = [...allMenus];
    let indexOffset = 0;
    allMenus.forEach((menu, index) => {
      if (!menu.relatedId) {
        rootMenus.push(MenuTreeItem.fromModel(menu));
        remainingMenus.splice(index - indexOffset++, 1);
      }
    });

    rootMenus.forEach(rootMenu => this.#populateChildrenMenus(remainingMenus, rootMenu));

    return rootMenus;
  }

  #getAllMenus() {
    return Menu.find();
  }

  #populateChildrenMenus(menus, menuItem) {
    const remainingMenus = [...menus];
    let indexOffset = 0;

    menus.forEach((menu, index) => {
      if (isSameObjectId(menu.relatedId, menuItem.id)) {
        const childrenMenuItem = MenuTreeItem.fromModel(menu);
        menuItem.submenus.push(childrenMenuItem);
        remainingMenus.splice(index - indexOffset++, 1);
      }
    });

    menuItem.submenus.forEach(submenu => this.#populateChildrenMenus(remainingMenus, submenu));
  }

  async isCyclicMenu(menuSchema) {
    const parentId = menuSchema.parent_menu_id;
    if (!parentId) {
      return false;
    }

    if (menuSchema.id === parentId) {
      return true;
    }

    return false; // TODO
  }

}

module.exports = MenuStructureService;
