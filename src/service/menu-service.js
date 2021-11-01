const Menu = require('../domain/model/menu-model');
const BusinessError = require('../exception/business-error');
const { isSameObjectId } = require('../utils/mongoose-utils');
const MenuRepository = require('../repository/menu-repository');
const MenuStructureService = require('./menu-structure-service');

class MenuService {
  #menuRepository = new MenuRepository();
  #menuStructureService = new MenuStructureService();

  list() {
    return this.#menuRepository.findAll();
  }

  async getById(id) {
    const result = await this.#menuRepository.findById(id);
    if (result.length) {
      return result[0];
    }
    return null;
  }

  async create(menuSchema) {
    await this.#validateMenu(menuSchema);

    const menuModel = new Menu({ name: menuSchema.name, relatedId: menuSchema.parent_menu_id });
    this.#menuRepository.save(menuModel);
    return menuModel;
  }

  async update(menuSchema) {
    const menuExists = await this.#menuRepository.existsById(menuSchema.id);
    if (!menuExists) {
      throw new BusinessError('The menu does not exists!');
    }

    await this.#validateMenu(menuSchema);

    await this.#menuRepository.updateById(menuSchema.id, 
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
      const parentMenuExists = await this.#menuRepository.existsById(menuSchema.parent_menu_id);
      if (!parentMenuExists) {
        throw new BusinessError('The parent menu does not exists!');
      }
    }
  }

  async #validateUniqueMenuName(menuSchema) {
    let menuIdWithSameName = await this.#menuRepository.findIdByName(menuSchema.name);

    if (!menuIdWithSameName) {
      return false;
    }

    const nameAlreadyTaken = menuSchema.id
      ? !isSameObjectId(menuSchema.id, menuIdWithSameName._id)
      : menuIdWithSameName._id != null;

    if (nameAlreadyTaken) {
      throw new BusinessError('This name is already owned by another menu.');
    }
  }

  async deleteById(id) {
    const hasSubmenu = await this.#menuRepository.existsByRelatedId(id);

    if (hasSubmenu) {
      throw new BusinessError('This menu has nested submenus and can not be deleted.');
    }

    const result = await this.#menuRepository.deleteById(id);
    return result.deletedCount > 0;
  }

}

module.exports = MenuService;