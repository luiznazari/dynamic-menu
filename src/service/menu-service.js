const Menu = require('../domain/model/menu-model');

class MenuService {

  list() {
    return Menu.find();
  }

  async getById(id) {
    const result =  await Menu.find({ _id: id });
    if (result.length) {
      return result[0];
    }
    return null;
  }

  async create(menuSchema) {
    await this.#validateParentMenu(menuSchema);

    const menuModel = new Menu({ name: menuSchema.name, relatedId: menuSchema.parent_menu_id });
    await menuModel.save();
    return menuModel;
  }

  async update(menuSchema) {
    const menuExists = await Menu.exists({ _id: menuSchema.id });
    if (!menuExists) {
      throw new BusinessError('The menu does not exists!');
    }

    await this.#validateParentMenu(menuSchema);

    await Menu.updateOne(
      { _id: menuSchema.id },
      { name: menuSchema.name, realatedId: menuSchema.parent_menu_id });
  }

  async #validateParentMenu(menuSchema) {
    if (menuSchema.parent_menu_id) {
      const parentMenuExists = await Menu.exists({ _id: menuSchema.parent_menu_id });
      if (!parentMenuExists) {
        throw new BusinessError('The parent menu does not exists!');
      }
    }
  }

  async deleteById(id) {
    const hasSubmenu = await Menu.count({ realatedId: id });

    if (hasSubmenu) {
      throw new BusinessError('This menu has nested submenus and can not be deleted.');
    }

    const result = await Menu.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

}

module.exports = MenuService;