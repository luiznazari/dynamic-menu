const Menu = require('../domain/model/menu-model');
const BusinessError = require('../exception/business-error');
const { isSameObjectId } = require('../utils/mongoose-utils');
const MenuStructureService = require('./menu-structure-service');

class MenuService {
  #menuStructureService = new MenuStructureService();

  list() {
    return Menu.find();
  }

  async getById(id) {
    const result = await Menu.find({ _id: id });
    if (result.length) {
      return result[0];
    }
    return null;
  }

  async create(menuSchema) {
    await this.#validateMenu(menuSchema);

    const menuModel = new Menu({ name: menuSchema.name, relatedId: menuSchema.parent_menu_id });
    await menuModel.save();
    return menuModel;
  }

  async update(menuSchema) {
    const menuExists = await Menu.exists({ _id: menuSchema.id });
    if (!menuExists) {
      throw new BusinessError('The menu does not exists!');
    }

    await this.#validateMenu(menuSchema);

    await Menu.updateOne(
      { _id: menuSchema.id },
      { name: menuSchema.name, relatedId: menuSchema.parent_menu_id });
  }

  async #validateMenu(menuSchema) {
    await this.#validateParentMenu(menuSchema);
    await this.#validateUniqueMenuName(menuSchema);
    
    const isCyclicMenu = await this.#menuStructureService.isCyclicMenu(menuSchema);
    if (isCyclicMenu) {
      throw new BusinessError('Cyclic Menu! This menu can not reference itself or be a children of a submenu.');
    }
  }

  async #validateParentMenu(menuSchema) {
    if (menuSchema.parent_menu_id) {
      const parentMenuExists = await Menu.exists({ _id: menuSchema.parent_menu_id });
      if (!parentMenuExists) {
        throw new BusinessError('The parent menu does not exists!');
      }
    }
  }

  async #validateUniqueMenuName(menuSchema) {
    let menuIdWithSameName = await Menu.findOne({ name: menuSchema.name }, '_id');

    const nameAlreadyTaken = isSameObjectId(menuSchema.id, menuIdWithSameName);
    if (nameAlreadyTaken) {
      throw new BusinessError('This name is already owned by another menu.');
    }
  }

  async deleteById(id) {
    const hasSubmenu = await Menu.exists({ relatedId: id });

    if (hasSubmenu) {
      throw new BusinessError('This menu has nested submenus and can not be deleted.');
    }

    const result = await Menu.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

}

module.exports = MenuService;