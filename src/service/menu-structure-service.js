const MenuTreeItem = require('../domain/schema/menu-tree-item');
const MenuRepository = require('../repository/menu-repository');
const { isSameObjectId } = require('../utils/mongoose-utils');

class MenuStructureService {
  #menuRepository = new MenuRepository();

  async getMenuTree() {
    const allMenus = await this.#menuRepository.findAll();
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
    if (!menuSchema.id || !menuSchema.parent_menu_id) {
      return false;
    }

    if (menuSchema.id === menuSchema.parent_menu_id) {
      return true;
    }

    const allSubmenus = await this.#getAllSubmenus(menuSchema.id);
    return allSubmenus.indexOf(menuSchema.parent_menu_id) !== -1;
  }

  async #getAllSubmenus(id) {
    const submenuIds = await this.#getSubmenus(id);

    let submenusSubmenusIds = await Promise.all(
      submenuIds.map(submenuId => this.#getAllSubmenus(submenuId))
    );
    submenusSubmenusIds = submenusSubmenusIds
      .reduce((accumulator, current) => accumulator.concat(current), []);

    return submenuIds.concat(submenusSubmenusIds);
  }

  async #getSubmenus(id) {
    return (await this.#menuRepository.findChildrenByParentId(id))
      .map(objectId => objectId.toString());
  }

}

module.exports = MenuStructureService;
